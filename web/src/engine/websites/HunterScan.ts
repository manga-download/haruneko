import { Tags } from '../Tags';
import icon from './HunterScan.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIResult<T> = {
    data: T
}

type APIManga = {
    id: string,
    title: string,
}

type APIChapter = {
    id: string,
    number: string,
    pages?: {
        page_url: string
    }[]
}

@Common.ImageAjax()

export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://admin.huntersscan.xyz/api/';
    public constructor() {
        super('hunterscan', 'Hunters Scan', 'https://huntersscan.xyz', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const slug = url.match(/\/(manga\/[^/]+)/)[1];
        const { data } = await FetchJSON<APIResult<APIManga>>(new Request(new URL(slug, this.apiUrl)));
        return new Manga(this, provider, data.id, data.title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.getMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    async getMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const request = new Request(new URL(`manga?page[number]=${page}`, this.apiUrl));
        const { data } = await FetchJSON<APIResult<APIManga[]>>(request);
        return data.map(manga => new Manga(this, provider, manga.id, manga.title.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.getChaptersFromPage(page, manga);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;
    }

    async getChaptersFromPage(page: number, manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(`manga/${manga.Identifier}/chapters?page[number]=${page}`, this.apiUrl));
        const { data } = await FetchJSON<APIResult<APIChapter[]>>(request);
        return data.map(chapter => new Chapter(this, manga, chapter.id, chapter.number));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(new URL(`chapter/${chapter.Identifier}/?includes[pages]=true`, this.apiUrl));
        const { data } = await FetchJSON<APIResult<APIChapter>>(request);
        return data.pages.map(page => new Page(this, chapter, new URL(page.page_url)));
    }
}