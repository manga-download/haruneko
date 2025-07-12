import { Tags } from '../Tags';
import icon from './Senkuro.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchGraphQL } from '../platform/FetchProvider';
import { Delay } from '../BackgroundTimers';

type APIManga = {
    manga: {
        slug: string,
        originalName: { content: string },
        branches: { id: string }[]
    }
}

type APIMangas = {
    mangas: {
        edges: { node: APIManga['manga'] }[],
        pageInfo: {
            hasNextPage: boolean,
            endCursor: string
        }
    }
}

type APIChapters = {
    mangaChapters: {
        edges: {
            node: {
                slug: string,
                number: string,
                name: string,
                volume: string
            }
        }[],
        pageInfo: {
            hasNextPage: boolean,
            endCursor: string
        }
    }
}

type APIPages = {
    mangaChapter: {
        pages: { image: { original: { url: string } } }[]
    }
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://api.senkuro.com/graphql';

    public constructor() {
        super('senkuro', 'Senkuro', 'https://senkuro.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Russian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+(\/chapters)?$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const slug = url.match(/manga\/([^/]+)/).at(-1);
        const { manga } = await this.FetchAPI<APIManga>('fetchManga', { slug }, '08f66ec9b6a68ceb58645213aa63f4a93e7cac2efa572654b88a625781da8b69');
        return new Manga(this, provider, manga.slug, manga.originalName.content);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangasList: Manga[] = [];
        for(let run = true, after: string = null; run;) {
            await Delay(250);
            const { mangas, mangas: { pageInfo: { hasNextPage, endCursor } } } = await this.FetchMangasData(after);
            mangasList.push(...mangas.edges.map(manga => new Manga(this, provider, manga.node.slug, manga.node.originalName.content)));
            after = endCursor;
            run = hasNextPage;
        }
        return mangasList;
    }

    private async FetchMangasData(after: string): Promise<APIMangas> {
        return this.FetchAPI<APIMangas>('fetchMangas', {
            after,
            orderDirection: 'DESC',
            orderField: 'CREATED_AT',
        }, '0fd2decbd14ae2ebcc09f6f19d0dd9474d323c55e44bd15041d18666316b0944');
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { manga: { branches } } = await this.FetchAPI<APIManga>('fetchManga', { slug: manga.Identifier }, '08f66ec9b6a68ceb58645213aa63f4a93e7cac2efa572654b88a625781da8b69');
        const chaptersList: Chapter[] = [];
        for (const branch of branches) {
            for(let run = true, after: string = null; run;) {
                const { mangaChapters, mangaChapters: { pageInfo: { hasNextPage, endCursor } } } = await this.FetchChaptersData(branch.id, after);
                chaptersList.push(...mangaChapters.edges.map(chapter => {
                    const title = [ 'Том', chapter.node.volume, 'Глава', chapter.node.number, chapter.node.name ].join(' ').trim();
                    return new Chapter(this, manga, chapter.node.slug, title);
                }));
                after = endCursor;
                run = hasNextPage;
            }
        }
        return chaptersList;
    }

    private FetchChaptersData(branchId: string, after: string): Promise<APIChapters> {
        return this.FetchAPI<APIChapters>('fetchMangaChapters', {
            after,
            branchId,
            orderBy: { direction: 'DESC', field: 'NUMBER' },
        }, '8c854e121f05aa93b0c37889e732410df9ea207b4186c965c845a8d970bdcc12');
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { mangaChapter: { pages } } = await this.FetchAPI<APIPages>('fetchMangaChapter', {
            cdnQuality: 'auto',
            slug: chapter.Identifier,
        }, '320a2637126c71ccdbce6af04325fe2f5878cc7adf9e90d06bdd6752f9bbb14e');
        return pages.map(page => new Page(this, chapter, new URL(page.image.original.url)));
    }

    private async FetchAPI<T extends JSONElement>(operation: string, variables: JSONObject, queryID: string, queryVersion = 1): Promise<T> {
        return FetchGraphQL<T>(new Request(new URL(this.apiUrl)), operation, undefined, variables, {
            persistedQuery: {
                sha256Hash: queryID,
                version: queryVersion,
            }
        });
    }
}