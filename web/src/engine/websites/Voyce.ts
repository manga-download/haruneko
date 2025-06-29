import { Tags } from '../Tags';
import icon from './Voyce.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchGraphQL, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type JSONMangaDetails = {
    pageProps: JSONManga
};

type JSONManga = {
    series: {
        id: number,
        title: string,
        slug: string
    }
};

type APIMangas = {
    voyce_series_top_views: JSONManga[]
};

type JSONChapters = {
    voyce_chapters: {
        id: number,
        title: string
    }[]
};

type APIPages = {
    voyce_chapter_images: {
        image: string;
    }[]
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private nextBuild = 'lBwCJne_LTVO_CHyDdfw5';
    private readonly graphQLEndpoint = 'https://graphql.voyce.me/v1/graphql/';
    private readonly cdnUrl = 'https://dlkfxmdtxtzpb.cloudfront.net/';

    public constructor() {
        super('voyce', `Voyce`, 'https://www.voyce.me', Tags.Language.English, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.nextBuild = await FetchWindowScript(new Request(new URL(this.URI)), `__NEXT_DATA__.buildId`, 2500) ?? this.nextBuild;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/series/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaId = url.split('/').at(-1);
        const { pageProps: { series } } = await FetchJSON<JSONMangaDetails>(new Request(new URL(`/_next/data/${this.nextBuild}/series/${mangaId}.json`, this.URI)));
        return new Manga(this, provider, series.slug, series.title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const query = `
            query SeriesTopViews {
                voyce_series_top_views(
                    where: { type: { _eq: alltime } }
                    order_by: {id: asc }
                ){
                    series {
                        id
                        title
                        slug
                    }
                }
            }
        `;
        const { voyce_series_top_views } = await FetchGraphQL<APIMangas>(new Request(new URL(this.graphQLEndpoint)), 'SeriesTopViews', query, {});
        return voyce_series_top_views.map(manga => new Manga(this, provider, manga.series.slug, manga.series.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const query = `
            query ChaptersBySeriesSlug {
                voyce_chapters(
                    where: {
                        publish: { _eq: 1 }
                        is_deleted: { _eq: false }
                        series: { slug: { _eq: "${manga.Identifier}" } }
                    }
                    order_by: { id: asc }
                ){
                    id
                    title
                }
            }
        `;
        const { voyce_chapters } = await FetchGraphQL<JSONChapters>(new Request(new URL(this.graphQLEndpoint)), 'ChaptersBySeriesSlug', query, {});
        return voyce_chapters.map(chapter => new Chapter(this, manga, chapter.id.toString(), chapter.title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const query = `
            query ChapterImagesById {
                voyce_chapter_images(
                    where: { chapter: { id: { _eq: ${chapter.Identifier } } } }
                    order_by: { sort_order: asc, id: asc }
                ){
                    image
                }
            }
        `;
        const { voyce_chapter_images } = await FetchGraphQL<APIPages>(new Request(new URL(this.graphQLEndpoint)), 'ChapterImagesById', query, {});
        return voyce_chapter_images.map(page => new Page(this, chapter, new URL(page.image, this.cdnUrl)));
    }
}