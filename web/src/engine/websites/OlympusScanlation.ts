import { Tags } from '../Tags';
import icon from './OlympusScanlation.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchRequest, FetchWindowScript } from '../FetchProvider';

type APIManga = {
    slug: string,
    type: string,
    name: string
}

type APIMangas = {
    data: {
        series: {
            data: APIManga[]
        }
    }
}

type APIChapter = {
    name: string,
    id: number,
    pages: string[]
}

type APIChapters = {
    data: APIChapter[]
}

type APIPages = {
    chapter: APIChapter
}

const mangaClipboardScript = `
    new Promise(resolve => {
        const path = window.location.pathname;
        const mangaSlug = __NUXT__.data[path].data.slug;
        const mangatype = __NUXT__.data[path].data.type;
        const mangaName = __NUXT__.data[path].data.name.trim();
        resolve({slug : mangaSlug, type : mangatype, name: mangaName });
    });

`;

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://dashboard.olympusv2.gg';
    public constructor() {
        super('olympusscanlation', 'Olympus Scanlation', 'https://olympusv2.gg/', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Spanish);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return /https?:\/\/olympusv2\.gg\/series\//.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const uri = new URL(url);
        const request = new FetchRequest(uri.href);
        const mangaObj = await FetchWindowScript <APIManga>(request, mangaClipboardScript);
        const slug = mangaObj.slug;
        const mangatype = mangaObj.type;
        const title = mangaObj.name.trim();
        const id = JSON.stringify({ slug: slug, type: mangatype });
        return new Manga(this,provider, id, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.getMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async getMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const uri = new URL(`/api/series?page=${page}&direction=asc`, this.apiUrl);
        const request = new FetchRequest(uri.href);
        const data = await FetchJSON<APIMangas>(request);
        return data.data.series.data.map(element => new Manga(this, provider, JSON.stringify({ slug: element.slug, type: element.type }), element.name.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterslist = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.getChaptersFromPage(page, manga);
            chapters.length > 0 ? chapterslist.push(...chapters) : run = false;
        }
        return chapterslist;
    }

    private async getChaptersFromPage(page: number, manga: Manga) : Promise<Chapter[]> {
        const mangaData = JSON.parse(manga.Identifier);
        const uri = new URL(`/api/series/${mangaData.slug}/chapters?page=${page}&direction=desc&type=${mangaData.type}`, this.apiUrl);
        const request = new FetchRequest(uri.href);
        const data = await FetchJSON <APIChapters>(request);
        return data.data.map(element => new Chapter(this, manga, String(element.id), element.name.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const mangaData = JSON.parse(chapter.Parent.Identifier);
        const uri = new URL(`/api/series/${mangaData.slug}/chapters/${chapter.Identifier}?type=${mangaData.type}`, this.apiUrl);
        const request = new FetchRequest(uri.href);
        const data = await FetchJSON<APIPages>(request);
        return data.chapter.pages.map(page => new Page(this, chapter, new URL(page)));
    }

}
