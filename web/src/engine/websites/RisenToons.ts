import { Tags } from '../Tags';
import icon from './RisenToons.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type APIMangas = {
    mangas: APIManga[];
};

type APIChapters = {
    chapters: {
        id: string;
        number: number;
        title: string;
    }[];
};

type APIMangaDetails = {
    data: APIManga;
};

type APIManga = {
    id: string;
    title: string;
};

type APIPages = {
    pages: {
        image_url: string;
    }[];
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    #token: null | string = null;
    private readonly apiURL = `${this.URI.origin}/api/`;

    public constructor() {
        super('risentoons', 'RisenToons', 'https://risentoons.xyz', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Scanlator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.#token = await FetchWindowScript(new Request(this.URI), `cookieStore.get('session_id').then(({ value }) => decodeURIComponent( value ) ?? null).catch(error => null);`, 750);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/biblioteca/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { data: { id, title } } = await this.FetchAPI<APIMangaDetails>(`./mangas/${url.split('/').at(-1)}`);
        return new Manga(this, provider, id, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { mangas: mangasData } = await this.FetchAPI<APIMangas>(`./mangas?limit=500&page=${page}`);
                const mangas = mangasData.map(({ id, title }) => new Manga(this, provider, id, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await this.FetchAPI<APIChapters>(`./mangas/${manga.Identifier}/chapters?limit=9999&page=1`);
        return chapters.map(({ id, title }) => new Chapter(this, manga, id, title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await this.FetchAPI<APIPages>(`./mangas/chapters/${chapter.Identifier}/pages`);
        return pages.map(({ image_url: image }) => new Page(this, chapter, new URL(image, this.URI)));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return await FetchJSON<T>(new Request(new URL(endpoint, this.apiURL), {
            headers: {
                ...this.#token && { Authorization: `Bearer ${this.#token}` },
                'X-Rip-Client': 'V6'
            }
        }));
    }
}