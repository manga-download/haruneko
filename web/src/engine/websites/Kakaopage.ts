import { Tags } from '../Tags';
import icon from './Kakaopage.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchGraphQL, FetchRequest } from '../FetchProvider';

type ApiClipBoard = {
    contentHomeOverview: {
        content: {
            id: string,
            seriesId: number,
            title: string
        }
    }
}

type APIChapters = {
    contentHomeProductList : {
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
        const id = parseInt(new URL(url).pathname.match(/content\/(\d+)/)[1]);
        const gql = `
            query contentHomeOverview($seriesId: Long!) {
              contentHomeOverview(seriesId: $seriesId) {
                content {
                  ...SeriesFragment
                }
              }
            }
            fragment SeriesFragment on Series {
              id
              seriesId
              title
            }
        `;
        const vars = { seriesId: id };
        const request = new FetchRequest(new URL('/graphql', this.URI).href, {
            headers: {
                Referer: this.URI.href,
                Origin: this.URI.href
            }
        });
        const operationName = 'contentHomeOverview';
        const { contentHomeOverview } = await FetchGraphQL<ApiClipBoard>(request, operationName, gql, JSON.stringify(vars));
        return new Manga(this, provider, String(contentHomeOverview.content.seriesId), contentHomeOverview.content.title.trim());
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        let nextCursor = '';
        const chapterList = [];
        for (let run = true; run;) {
            const data = await this.getChaptersFromPage(manga, nextCursor);
            const chapters = data.contentHomeProductList.edges.map(chapter => new Chapter(this, manga, chapter.node.single.productId.toString(), chapter.node.single.title.replace(manga.Title, '').trim()));
            nextCursor = data.contentHomeProductList.pageInfo.hasNextPage ? data.contentHomeProductList.pageInfo.endCursor : null;
            chapterList.push(...chapters);
            run = nextCursor != null;
        }
        return chapterList;
    }

    async getChaptersFromPage(manga: Manga, nextCursor: string): Promise<APIChapters> {
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
                totalCount
                pageInfo {
                  hasNextPage
                  endCursor
                  hasPreviousPage
                  startCursor
                }
                edges {
                  cursor
                  node {
                    ...SingleListViewItem
                  }
                }
              }
            }
            fragment SingleListViewItem on SingleListViewItem {
              id
              type
              single {
                productId
                id
                isFree
                thumbnail
                title
                slideType
              }
            }

        `;
        const vars = {
            seriesId: parseInt(manga.Identifier),
            boughtOnly: false,
            sortType: 'asc',
            after: nextCursor
        };
        const request = new FetchRequest(new URL('/graphql', this.URI).href, {
            headers: {
                Referer: this.URI.href,
                Origin: this.URI.href
            }
        });
        const operationName = 'contentHomeProductList';
        return await FetchGraphQL<APIChapters>(request, operationName, gql, JSON.stringify(vars));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const gql = `
            query viewerInfo($seriesId: Long!, $productId: Long!) {
              viewerInfo(seriesId: $seriesId, productId: $productId) {
                viewerData {
                  ...ImageViewerData
                  __typename
                }
                __typename
              }
            }

            fragment ImageViewerData on ImageViewerData {
              type
              imageDownloadData {
                ...ImageDownloadData
                __typename
              }
            }

            fragment ImageDownloadData on ImageDownloadData {
              files {
                ...ImageDownloadFile
                __typename
              }
            }

            fragment ImageDownloadFile on ImageDownloadFile {
              no
              secureUrl
            }

        `;
        const vars = {
            productId: parseInt(chapter.Identifier),
            seriesId: parseInt(chapter.Parent.Identifier)
        };
        const request = new FetchRequest(new URL('/graphql', this.URI).href, {
            headers: {
                Referer: this.URI.href,
                Origin: this.URI.href
            }
        });
        const operationName = 'viewerInfo';

        try {
            const data = await FetchGraphQL<APiPages>(request, operationName, gql, JSON.stringify(vars));
            return data.viewerInfo.viewerData.imageDownloadData.files.map(page => new Page(this, chapter, new URL(page.secureUrl)));
        } catch (error) {
            return [];
        }
    }
}