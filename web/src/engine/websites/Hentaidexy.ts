import { Tags } from '../Tags';
import icon from './Hentaidexy.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIManga = {
    manga: {
        _id: string,
        title: string
    }
}

type APIMangas = {
    mangas: {
        _id: string,
        title: string
    }[]
}

type ApiChapters = {
    chapters: {
        _id: string,
        serialNumber: string
    }[]
}

type ApiPage = {
    chapter: {
        images: string[]
    }
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://backend.hentaidexy.net';
    private readonly imageBaseUrl = 'https://s1.cdnimg.me:9000';

    public constructor() {
        super('hentaidexy', 'Hentaidexy', 'https://hentaidexy.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/manga/\\S+/\\S+`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = new URL(url).pathname.match(/\/manga\/([\S]+)\//)[1];
        const uri = new URL('/api/v1/mangas/' + id, this.apiUrl);
        const request = new Request(uri.href);
        const data = await FetchJSON<APIManga>(request);
        return new Manga(this, provider, id, data.manga.title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin) : Promise<Manga[]>{
        const mangaList: Array<Manga> = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(provider, page);
            mangaList.isMissingLastItemFrom(mangas) ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(provider: MangaPlugin, page: number): Promise<Manga[]> {
        const uri = new URL('/api/v1/mangas?page=' + page + '&sort=createdAt', this.apiUrl);
        const request = new Request(uri.href);
        const data = await FetchJSON<APIMangas>(request);
        return data.mangas.map(element => new Manga(this, provider, element._id, element.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;
    }

    private async GetChaptersFromPage(manga: Manga, page: number): Promise<Chapter[]> {
        const uri = new URL('/api/v1/mangas/' + manga.Identifier + '/chapters?sort=-serialNumber&limit=9999&page=' + page, this.apiUrl);
        const request = new Request(uri.href);
        const data = await FetchJSON<ApiChapters>(request);
        return data.chapters.map(element => new Chapter(this, manga, element._id, 'Chapter ' + element.serialNumber));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const uri = new URL('/api/v1/chapters/' + chapter.Identifier, this.apiUrl);
        const request = new Request(uri.href);
        const data = await FetchJSON<ApiPage>(request);
        return data.chapter.images.map(image => {
            const lastpart = image.split('/').pop();
            return new Page(this, chapter, new URL('/hentaidexy/' + lastpart, this.imageBaseUrl));
        });
    }
}