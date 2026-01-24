import { Tags } from '../Tags';
import icon from './Remanga.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { Delay } from '../BackgroundTimers';

type APIResult<T> = {
    results: T;
}

type APIManga = {
    dir: string;
    main_name: null | string;
    secondary_name: string;
    branches: {
        id: number;
    }[] | null;
};

type APIMangas = APIResult<APIManga[]>;

type APIChapter = {
    id: number;
    chapter: string;
    name: string;
    tome: number;
};

type APIChapters = APIResult<APIChapter[]>;

type APIPages = {
    pages: Array<Array<{ link: string }>>
}

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://api.remanga.org/api/v2/';
    #token: null | string = null;

    public constructor() {
        super('remanga', 'Remanga', 'https://remanga.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Russian, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        // TODO: Update the token whenever the user performs a login/logout through manual website interaction
        this.#token = await FetchWindowScript(new Request(this.URI), `cookieStore.get('token').then(({ value }) => value ?? null).catch(error => null);`, 750);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+/main$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { dir, main_name, secondary_name } = await this.FetchAPI<APIManga>(`./titles/${new URL(url).pathname.split('/').at(-2)}/`);
        return new Manga(this, provider, dir, main_name ?? secondary_name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run ; page++) {
                await Delay(500);
                const { results } = await this.FetchAPI<APIMangas>(`./search/catalog/?count=30&ordering=score&page=${page}`);
                const mangas = !results ? [] : results.map(({ dir, main_name: mainName, secondary_name: altName }) => new Manga(this, provider, dir, mainName ?? altName));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { branches } = await this.FetchAPI<APIManga>(`./titles/${manga.Identifier}/`);
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { results } = await this.FetchAPI<APIChapters>(`./titles/chapters/?branch_id=${branches.at(0).id}&ordering=-index&page=${page}`);
                const chapters = !results ? [] : results.map(({ id, chapter, name, tome }) => new Chapter(this, manga, `${id}`, [`Vol.${tome}`, `Ch.${chapter}`, name ?? ''].join(' ').trim()));
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await this.FetchAPI<APIPages>(`./titles/chapters/${chapter.Identifier}/`);
        return pages.flat().map(({ link }) => new Page(this, chapter, new URL(link), { Referer: this.URI.href }));
    }

    public async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return FetchJSON<T>(new Request(new URL(endpoint, this.apiUrl), {
            headers: {
                ...this.#token && { Authorization: `Bearer ${this.#token}` }
            }
        }));
    }
}