import { Tags } from '../Tags';
import icon from './GalaxyManga.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIManga = {
    status: boolean,
    message: string,
    serie: {
        id: number,
        title:string
    }
}

type APIMangas = {
    data: {
        id: number,
        title: string
    }[]
}

type APIChapter = {
    id: number,
    title: string,
    name: string
}

type APIPages = {
    chapter: {
        chapterData: {
            webtoon: string[]
        }
    }
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiurl = 'https://api.flixscans.com';

    public constructor() {
        super('galaxymanga', 'Galaxy Manga', 'https://flixscans.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Arabic, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/series/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = new URL(url).pathname.split('-')[1];
        const request = new Request(`${this.apiurl}/api/v1/webtoon/series/${id}`);
        const { serie } = await FetchJSON<APIManga>(request);
        return new Manga(this, provider, serie.id.toString(), serie.title);
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
        const request = new Request(`${this.apiurl}/api/v1/webtoon/homepage/latest/home?page=${page}`);
        const { data } = await FetchJSON<APIMangas>(request);
        return data.map(manga => new Manga(this, provider, String(manga.id), manga.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(`${this.apiurl}/api/v1/webtoon/chapters/${manga.Identifier}-desc`);
        const data = await FetchJSON<APIChapter[]>(request);
        return data.map(chapter => new Chapter(this, manga, chapter.id.toString(), `${chapter.name} ${chapter.title || ''}`.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(`${this.apiurl}/api/v1/webtoon/chapters/chapter/${chapter.Identifier}`);
        const data = await FetchJSON<APIPages>(request);
        return data.chapter.chapterData.webtoon.map(image => new Page(this, chapter, new URL(`/storage/${image}`, this.apiurl)));
    }

}