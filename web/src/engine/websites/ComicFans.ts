import { Tags } from '../Tags';
import icon from './ComicFans.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIPagedResult<T> = {
    data: {
        list: T
    }
}

type APIResult<T> = {
    data: T
}

type APIManga = {
    id: number,
    title: string
}

type APIChapter = {
    id: number,
    title: string,
    chapterOrder: number
}

type APIPages = {
    data: {
        comicImageList: {
            imageUrl: string
        }[]
    }
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://api.comicfans.io/comic-backend/api/v1/content/';
    private readonly cdnUrl = 'https://static.comicfans.io/';

    public constructor() {
        super('comicfans', 'ComicFans', 'https://comicfans.io', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return /https:\/\/(comicfans\.io|bilibilicomics\.net)\/comic\/\d+-[^/]+$/.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaid = url.match(/\/comic\/(\d+)/)[1];
        const apiEndpoint = new URL(`books/${mangaid}`, this.apiUrl);
        const { data } = await FetchJSON<APIResult<APIManga>>(new Request(apiEndpoint));
        return new Manga(this, provider, data.id.toString(), data.title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const url = new URL('books?&pageNumber=1&pageSize=9999', this.apiUrl);
        const { data: { list } } = await FetchJSON<APIPagedResult<APIManga[]>>(new Request(url));
        return list.map(manga => new Manga(this, provider, manga.id.toString(), manga.title.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList.distinct();
    }

    private async GetChaptersFromPage(manga: Manga, page: number): Promise<Chapter[]> {
        const url = new URL('chapters/page', this.apiUrl);
        url.search = new URLSearchParams({
            sortDirection: 'ASC',
            bookId: manga.Identifier,
            pageNumber: page.toString(),
            pageSize: '100'
        }).toString();
        const { data: { list } } = await FetchJSON<APIPagedResult<APIChapter[]>>(new Request(url));
        return list.map(chapter => new Chapter(this, manga, chapter.id.toString(), [chapter.chapterOrder, chapter.title.trim()].join(' - ')));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const url = new URL(`chapters/${chapter.Identifier}`, this.apiUrl);
        const { data: { comicImageList } } = await FetchJSON<APIPages>(new Request(url));
        return comicImageList.map(page => new Page(this, chapter, new URL(page.imageUrl, this.cdnUrl)));
    }

}