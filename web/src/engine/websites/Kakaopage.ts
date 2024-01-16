import { Tags } from '../Tags';
import icon from './Kakaopage.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchGraphQL } from '../platform/FetchProvider';
import type { JSONObject } from '../../../../node_modules/websocket-rpc/dist/types';

type APIChapters = {
    contentHomeProductList: {
        edges: {
            node: {
                single: {
                    productId: number,
                    title: string
                }
            }
        }[],
        pageInfo: {
            hasNextPage: boolean,
            endCursor: string
        }
    }
}

type APiPages = {
    viewerInfo: {
        viewerData: {
            imageDownloadData: {
                files: {
                    secureUrl: string
                }[]
            }
        }
    }
}

@Common.MangasNotSupported()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('kakaopage', `Page Kakao (카카오페이지)`, 'https://page.kakao.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Korean, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/content/[\\d]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = new URL(url).pathname.match(/content\/(\d+)/)[1];
        const data = await FetchCSS<HTMLTitleElement>(new Request(url), 'title');
        return new Manga(this, provider, id, data[0].text.split(' - ')[0].trim());
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        let nextCursor = null;
        const chapterList: Chapter[] = [];

        const gql = `
            query contentHomeProductList(
              $after: String
              $before: String
              $first: Int
              $last: Int
              $seriesId: Long!
              $boughtOnly: Boolean
              $sortType: String
            ) {
              contentHomeProductList(
                seriesId: $seriesId
                after: $after
                before: $before
                first: $first
                last: $last
                boughtOnly: $boughtOnly
                sortType: $sortType
              ) {
                pageInfo {
                  hasNextPage
                  endCursor
                }
                edges {
                  node {
                    ...SingleListViewItem
                  }
                }
              }
            }
            fragment SingleListViewItem on SingleListViewItem {
              single {
                productId
                title
              }
            }

        `;

        do {
            const request = new Request(new URL('/graphql', this.URI).href, {
                headers: {
                    Referer: this.URI.href,
                    Origin: this.URI.href
                }
            });

            const vars: JSONObject = {
                seriesId: parseInt(manga.Identifier),
                boughtOnly: false,
                sortType: 'asc',
                after: nextCursor
            };

            const data = await FetchGraphQL<APIChapters>(request, 'contentHomeProductList', gql, vars);
            const chapters = data.contentHomeProductList.edges.map(chapter => new Chapter(this, manga, chapter.node.single.productId.toString(), chapter.node.single.title.replace(manga.Title, '').trim()));
            nextCursor = data.contentHomeProductList.pageInfo.hasNextPage ? data.contentHomeProductList.pageInfo.endCursor : null;
            chapterList.push(...chapters);
        } while (nextCursor);

        return chapterList;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const gql = `
                query viewerInfo($seriesId: Long!, $productId: Long!) {
                  viewerInfo(seriesId: $seriesId, productId: $productId) {
                    viewerData {
                      ...ImageViewerData
                    }
                  }
                }
                
                fragment ImageViewerData on ImageViewerData {
                  imageDownloadData {
                    files {
                      ... {
                        no
                        secureUrl
                      }
                    }
                  }
                }
        `;
        const vars: JSONObject = {
            productId: parseInt(chapter.Identifier),
            seriesId: parseInt(chapter.Parent.Identifier)
        };
        const request = new Request(new URL('/graphql', this.URI).href, {
            headers: {
                Referer: this.URI.href,
                Origin: this.URI.href
            }
        });

        const data = await FetchGraphQL<APiPages>(request, 'viewerInfo', gql, vars);
        return data.viewerInfo.viewerData.imageDownloadData.files.map(page => new Page(this, chapter, new URL(page.secureUrl)));

    }
}