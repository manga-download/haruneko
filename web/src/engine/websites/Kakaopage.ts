import { Tags } from '../Tags';
import icon from './Kakaopage.webp';
import { FetchCSS, FetchGraphQL } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type GQLChapters = {
    contentHomeProductList: {
        edges: {
            node: {
                single: {
                    productId: number;
                    title: string;
                };
            };
        }[],
        pageInfo: {
            hasNextPage: boolean;
            endCursor: string;
        };
    };
};

type GQLPages = {
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

@Common.MangasNotSupported()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURI = new URL('/graphql', 'https://bff-page.kakao.com');

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
        for (let run = true, cursor: string = undefined; run;) {
            const { contentHomeProductList: { edges, pageInfo: { hasNextPage, endCursor } } } = await this.FetchGQL<GQLChapters>(`
                query ($seriesId: Long!, $after: String) {
                    contentHomeProductList(seriesId: $seriesId, after: $after, boughtOnly: false, sortType: "asc") {
                        pageInfo { hasNextPage, endCursor }
                        edges { node { single { productId, title } } }
                    }
                }
            `, {
                seriesId: parseInt(manga.Identifier),
                after: cursor,
            });
            const chapters = edges.map(chapter => new Chapter(this, manga, chapter.node.single.productId.toString(), chapter.node.single.title.replace(manga.Title, '').trim()));
            chapterList.push(...chapters);
            cursor = endCursor;
            run = hasNextPage;
        }

        return chapterList;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { viewerInfo: { viewerData: { imageDownloadData: { files } } } } = await this.FetchGQL<GQLPages>(`
            query ($seriesId: Long!, $productId: Long!) {
                viewerInfo(seriesId: $seriesId, productId: $productId) {
                    viewerData {
                        ... on ImageViewerData {
                            imageDownloadData { files {  secureUrl } }
                        }
                    }
                }
            }
        `, {
            productId: parseInt(chapter.Identifier),
            seriesId: parseInt(chapter.Parent.Identifier),
        });
        return files.map(page => new Page(this, chapter, new URL(page.secureUrl)));
    }

    private FetchGQL<T extends JSONElement>(query: string, variables: JSONObject): Promise<T> {
        const request = new Request(this.apiURI, {
            headers: {
                Referer: this.URI.href,
            }
        });
        return FetchGraphQL<T>(request, undefined, query, variables);
    }
}