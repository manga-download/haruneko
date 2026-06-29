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
    id: string;
    chapters: {
        id: string;
        number: string;
        title: string;
    }[];
};

type APIPages = {
    pages: string[];
};

class CustomRequest extends Request {
    constructor(input: RequestInfo | URL, init?: RequestInit ) {
        const headers = new Headers(init?.headers);
        headers.set('Accept-Language', 'pt-BR,en-US;q=0.9,en;q=0.8');
        headers.set('X-Tly-Sec', 'web-z99');
        super(input, { ...init, headers });
    }
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/`;

    public constructor() {
        super('mangalivre', 'ToonLivre', 'https://toonlivre.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Language.Portuguese, Tags.Accessibility.RegionLocked);
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
        const { id: mangaId, chapters } = await this.FetchAPI<APIChapters>(`./manga-by-slug/${manga.Identifier}`);
        return chapters.map(({ id, number, title }) => new Chapter(this, manga, `./mangas/${mangaId}/chapters/${id}`, ['Capítulo', number, title].joinTitleSegments()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await this.FetchAPI<APIPages>(chapter.Identifier);
        return pages.map(page => new Page(this, chapter, new URL(page, this.URI)));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return FetchJSON<T>(new CustomRequest(new URL(endpoint, this.apiURL)));
    }
}