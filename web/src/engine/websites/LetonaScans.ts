import { Tags } from '../Tags';
import icon from './LetonaScans.webp';
import { FetchGraphQL, FetchNextJS } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type HydratedChapter = {
    images: {
        url: string
    }[]
}

type APIMangaDetails = {
    novelBySlug: APIManga
}

type APIMangas = {
    novels: {
        novels: APIManga[]
    }
}

type APIManga = {
    title: string,
    slug: string
    chapters: APIChapter[]
}

type APIChapter = {
    id: string,
    number: number
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://letonascans.com/graphql';

    public constructor() {
        super('letonascans', 'Letona Scans', 'https://letonascans.com', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Turkish, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const slug = url.split('/').at(-1);
        const query = `
            query GetSeriesInfo($slug: String!) {
              novelBySlug(slug: $slug) {
                title
                contentType
              }
            }
        `;
        const { novelBySlug: { title } } = await this.FetchAPI<APIMangaDetails>('GetSeriesInfo', query, { slug });
        return new Manga(this, provider, slug, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const query = `
            query GetAllNovelsPaginated(
              $page: Int
              $limit: Int
              $sort: NovelSortInput
              $filter: NovelFilterInput
            ) {
              novels(page: $page, limit: $limit, sort: $sort, filter: $filter) {
                novels {
                  title
                  slug
                }
              }
            }
        `;
        const { novels: { novels } } = await this.FetchAPI<APIMangas>('GetAllNovelsPaginated', query, {
            filter: {},
            limit: 9999,
            page: 1,
            sort: {
                ascending: false,
                field: 'updatedAt'
            }
        });
        return novels.map(manga => new Manga(this, provider, manga.slug, manga.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const query = `
            query GetSeriesInfo($slug: String!) {
              novelBySlug(slug: $slug) {
                chapters {
                    number
                }
              }
            }
        `;
        const { novelBySlug: { chapters } } = await this.FetchAPI<APIMangaDetails>('GetSeriesInfo', query, { slug: manga.Identifier });
        return chapters.map(chapter => new Chapter(this, manga, `/manga/${manga.Identifier}/bolum/${chapter.number}`, chapter.number.toString()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { images } = await FetchNextJS<HydratedChapter>(new Request(new URL(chapter.Identifier, this.URI)), data => 'images' in data);
        return images.map(image => new Page(this, chapter, new URL(image.url, this.URI)));
    }

    private async FetchAPI<T extends JSONElement>(operationName: string, query: string, variables: JSONObject): Promise<T> {
        return FetchGraphQL<T>(new Request(new URL(this.apiUrl)), operationName, query, variables);
    }
}