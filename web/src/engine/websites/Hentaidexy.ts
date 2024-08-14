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

type APIChapters = {
    chapters: {
        _id: string,
        serialNumber: string
    }[]
}

type APIPage = {
    chapter: {
        images: string[]
    }
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = `${this.URI.origin}/api/`;

    public constructor() {
        super('hentaidexy', 'Hentaidexy', 'https://dexyscan.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Rating.Erotica, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = new URL(url).pathname.match(/\/manga\/([^/]+)\//)[1];
        const { manga } = await FetchJSON<APIManga>(new Request(new URL(`mangas/${id}`, this.apiUrl)));
        return new Manga(this, provider, id, manga.title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin) : Promise<Manga[]>{
        const mangaList: Manga[] = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(provider, page);
            mangaList.isMissingLastItemFrom(mangas) ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(provider: MangaPlugin, page: number): Promise<Manga[]> {
        const { mangas } = await FetchJSON<APIMangas>(new Request(new URL(`mangas?page=${page}&sort=createdAt`, this.apiUrl)));
        return mangas.map(element => new Manga(this, provider, element._id, element.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList : Chapter[]= [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;
    }

    private async GetChaptersFromPage(manga: Manga, page: number): Promise<Chapter[]> {
        const { chapters } = await FetchJSON<APIChapters>(new Request(new URL(`mangas/${manga.Identifier}/chapters?sort=-serialNumber&limit=9999&page=${page}`, this.apiUrl)));
        return chapters.map(element => new Chapter(this, manga, element._id, 'Chapter ' + element.serialNumber));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { chapter: { images } } = await FetchJSON<APIPage>(new Request(new URL(`chapters/${chapter.Identifier}`, this.apiUrl)));
        return images.map(image => new Page(this, chapter, new URL(image)));
    }
}