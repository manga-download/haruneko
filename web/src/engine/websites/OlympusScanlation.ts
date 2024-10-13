import { Tags } from '../Tags';
import icon from './OlympusScanlation.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

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

    private readonly apiUrl = 'https://dashboard.leerolymp.com';
    public constructor() {
        super('olympusscanlation', 'Olympus Scanlation', 'https://leerolymp.com/', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/series/`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { slug, type, name } = await FetchWindowScript<APIManga>(new Request(new URL(url)), mangaClipboardScript);
        const id = JSON.stringify({ slug: slug, type: type });
        return new Manga(this, provider, id, name.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const { data: { series: { data } } } = await FetchJSON<APIMangas>(new Request(new URL(`/api/series?page=${page}&direction=asc`, this.apiUrl)));
        return data.map(element => new Manga(this, provider, JSON.stringify({ slug: element.slug, type: element.type }), element.name.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterslist = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(page, manga);
            chapters.length > 0 ? chapterslist.push(...chapters) : run = false;
        }
        return chapterslist;
    }

    private async GetChaptersFromPage(page: number, manga: Manga): Promise<Chapter[]> {
        const { slug, type } = JSON.parse(manga.Identifier) as APIManga;
        const { data } = await FetchJSON<APIChapters>(new Request(new URL(`/api/series/${slug}/chapters?page=${page}&direction=desc&type=${type}`, this.apiUrl)));
        return data.map(element => new Chapter(this, manga, String(element.id), element.name.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { slug, type } = JSON.parse(chapter.Parent.Identifier) as APIManga;
        const { chapter: { pages } } = await FetchJSON<APIPages>(new Request(new URL(`/api/series/${slug}/chapters/${chapter.Identifier}?type=${type}`, this.apiUrl)));
        return pages.map(page => new Page(this, chapter, new URL(page)));
    }
}