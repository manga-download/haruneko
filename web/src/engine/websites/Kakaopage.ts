import { Tags } from '../Tags';
import icon from './Kakaopage.webp';
import { FetchCSS, FetchGraphQL } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIChapters = {
    contentHomeProductList: {
        edges: {
            node: {
                single: {
                    productId: number,
                    title: string;
                };
            };
        }[],
        pageInfo: {
            hasNextPage: boolean,
            endCursor: string;
        };
    };
};

type APiPages = {
    viewerInfo: {
        viewerData: {
            imageDownloadData: {
                files: {
                    secureUrl: string;
                }[];
            };
        };
    };
};

const gqlChapterQuery = `
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

const gqlPageQuery = `
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

// TODO: Check for possible revision (GraphQL)

@Common.MangasNotSupported()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://bff-page.kakao.com';

    public constructor () {
        super('kakaopage', 'Page Kakao (카카오페이지)', 'https://page.kakao.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Korean, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/content/[\\d]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = new URL(url).pathname.match(/content\/(\d+)/).at(1);
        const data = await FetchCSS<HTMLTitleElement>(new Request(url), 'title');
        return new Manga(this, provider, id, data[ 0 ].text.split(' - ').at(0).trim());
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList: Chapter[] = [];
        const gqlVariables: JSONObject = {
            seriesId: parseInt(manga.Identifier),
            boughtOnly: false,
            sortType: 'asc',
            after: <string>undefined,
        };

        for (let run = true; run;) {
            const { contentHomeProductList: { edges, pageInfo: { hasNextPage, endCursor } } } = await FetchGraphQL<APIChapters>(this.CreateRequest(), 'contentHomeProductList', gqlChapterQuery, gqlVariables);
            const chapters = edges.map(chapter => new Chapter(this, manga, chapter.node.single.productId.toString(), chapter.node.single.title.replace(manga.Title, '').trim()));
            chapterList.push(...chapters);
            gqlVariables.after = endCursor;
            run = hasNextPage;
        }

        return chapterList;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const gqlVariables: JSONObject = {
            productId: parseInt(chapter.Identifier),
            seriesId: parseInt(chapter.Parent.Identifier)
        };
        const { viewerInfo: { viewerData: { imageDownloadData: { files } } } } = await FetchGraphQL<APiPages>(this.CreateRequest(), 'viewerInfo', gqlPageQuery, gqlVariables);
        return files.map(page => new Page(this, chapter, new URL(page.secureUrl)));
    }

    private CreateRequest(): Request {
        return new Request(new URL('/graphql', this.apiUrl), {
            headers: {
                Referer: this.URI.href,
            }
        });
    }
}