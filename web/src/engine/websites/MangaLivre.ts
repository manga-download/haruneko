import { Tags } from '../Tags';
import icon from './MangaLivre.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

// Nothing will work unless request language is set to pt-BR

type APIManga = {
    id: string;
    title: string;
};

type APIMangas = {
    mangas: APIManga[];
};

type APIChapters = {
    chapters: {
        id: string;
        number: string;
        title: string;
    }[];
};

type APIPages = {
    pages: string[];
};

type APIToken = {
    token: string;
};

class CustomRequest extends Request {
    constructor(input: RequestInfo | URL, init?: RequestInit) {
        super(input, {
            ...init,
            headers: {
                'Accept-Language': 'pt-BR,en-US;q=0.9,en;q=0.8',
                'Sec-Fetch-Site': 'same-origin',
                ...init?.headers || {}
            }
        });
    }
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/`;

    public constructor() {
        super('mangalivre', 'ToonLivre', 'https://toonlivre.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Language.Portuguese);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new CustomRequest(this.URI), '');
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { id, title } = await this.FetchAPI<APIManga>(`./manga-by-slug/${url.split('/').at(-1)}`);
        return new Manga(this, provider, id, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { mangas: entries } = await this.FetchAPI<APIMangas>(`./mangas/releases?limit=9999&page=${page}`);
                const mangas = entries.map(({ id, title }) => new Manga(this, provider, id, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        //open to get cookies
        await FetchWindowScript(new CustomRequest(new URL(`/${this.Slugify(manga.Title)}`, this.URI)), '', 1500);

        const { token } = await this.FetchAPI<APIToken>(`./chapter-token/${manga.Identifier}`);

        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { chapters: chaptersData } = await this.FetchAPI<APIChapters>(`./mangas/${manga.Identifier}/chapters-paginated?page=${page}&limit=100`, token);
                const chapters = chaptersData.map(({ id, number, title }) => new Chapter(this, manga, id, ['Capítulo', number, title].joinTitleSegments()));
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { token } = await this.FetchAPI<APIToken>(`./chapter-token/${chapter.Parent.Identifier}/${chapter.Identifier}`);
        const { pages } = await this.FetchAPI<APIPages>(`./mangas/${chapter.Parent.Identifier}/chapters/${chapter.Identifier}`, token);
        return pages.map(page => new Page(this, chapter, new URL(page, this.URI)));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string, token: string = undefined): Promise<T> {
        return FetchJSON<T>(new Request(new URL(endpoint, this.apiURL), {
            headers: {
                'Accept-Language': 'pt-BR,en-US;q=0.9,en;q=0.8',
                'Sec-Fetch-Site': 'same-origin',
                ...token && { 'X-Toon-Route-Token': token }
            }
        }));
    }

    private Slugify(title: string): string {
        return (title || '').toString().toLowerCase().normalize('NFD').replace(new RegExp('\\p{Diacritic}', 'gu'), "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
}