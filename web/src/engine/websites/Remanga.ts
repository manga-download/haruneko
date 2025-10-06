import { Tags } from '../Tags';
import icon from './Remanga.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type APIResult<T> = {
    results: T;
}

type APIManga = {
    dir: string;
    main_name: string;
    secondary_name: string;
    branches: {
        id: number;
    }[] | null;
};

type APIChapter = {
    id: number;
    chapter: string;
    name: string;
    tome: number;
};

type APIPages = {
    pages: Array<Array<{ link: string }>>
}

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://api.remanga.org/api/v2/';
    private token: string = undefined;

    public constructor() {
        super('remanga', 'Remanga', 'https://remanga.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Russian, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+/main$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const slug = new URL(url).pathname.split('/').at(-2);
        const { dir, main_name, secondary_name } = await this.GetMangaDetails(slug);
        return new Manga(this, provider, dir, main_name ?? secondary_name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangaList.push(...mangas);
            run = mangas.length > 0 && page < 1000; //website api is limited to 999 pages
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const { results } = await FetchJSON<APIResult<APIManga[]>>(new Request(new URL(`./search/catalog/?count=30&ordering=score&page=${page}`, this.apiUrl)));
        return results.map(manga => new Manga(this, provider, manga.dir, manga.main_name ?? manga.secondary_name));
    }

    private async GetMangaDetails(slug: string): Promise<APIManga> {
        return FetchJSON<APIManga>(new Request(new URL(`./titles/${slug}/`, this.apiUrl)));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList: Chapter[] = [];
        const { branches } = await this.GetMangaDetails(manga.Identifier);
        if (branches) {
            for (let page = 1, run = true; run; page++) {
                const chapters = await this.GetChaptersFromPage(manga, page, branches.at(0).id);
                chapters.length > 0 ? chapterList.push(...chapters) : run = false;
            }
        };
        return chapterList.distinct();
    }

    private async GetChaptersFromPage(manga: Manga, page: number, branchId: number): Promise<Chapter[]> {
        const { results } = await FetchJSON<APIResult<APIChapter[]>>(new Request(new URL(`./titles/chapters/?branch_id=${branchId}&ordering=-index&page=${page}`, this.apiUrl)));
        return results.map(({ id, chapter, name, tome }) => new Chapter(this, manga, `${id}`, [`Vol.${tome}`, `Ch.${chapter}`, name ?? ''].join(' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        if (!this.token) this.token = await FetchWindowScript(new Request(this.URI), `(async () => (await cookieStore.get('token'))?.value ?? undefined)();`, 750);

        const request = new Request(new URL(`./titles/chapters/${chapter.Identifier}/`, this.apiUrl));
        if (this.token) request.headers.set('Authorization', 'Bearer ' + this.token);

        const { pages } = await await FetchJSON<APIPages>(request);
        return pages.reduce((accumulator: Page[], entry) => {
            const entryPages = entry.map(({ link }) => new Page(this, chapter, new URL(link), { Referer: this.URI.href }));
            accumulator.push(...entryPages);
            return accumulator;
        }, []);
    }
}