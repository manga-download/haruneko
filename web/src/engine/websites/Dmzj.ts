import { Tags } from '../Tags';
import icon from './Dmzj.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIResult<T> = {
    errno: number,
    errmsg: string,
    data: T
}

type APIComicList = {
    comicList: APIManga[]
}

type APIComicSingle = {
    comicInfo: APIManga
}

type APIChapterInfo = {
    chapterInfo: APIChapter
}

type APIManga = {
    id: number,
    name: string,
    title: string
    comicPy: string,
    comic_py: string, //yes api is dumb like that
    chapterList: APIChapter[]
}

type APIChapter = {
    title: string,
    data: {
        chapter_id: number,
        chapter_title: string
    }[]
    page_url_hd: string[],
    page_url: string[]
}

type ChapterID = {
    comicId: number,
    chapterId: number
}

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('dmzj', `动漫之家(DMZJ)`, 'https://www.idmzj.com', Tags.Language.Chinese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string) {
        return new RegExp(`^${this.URI.origin}/info/\\S+.html$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const comicPy = url.match(/\/info\/(\S+)\.html$/)[1];
        const request = new Request(new URL(`/api/v1/comic1/comic/detail?comic_py=${comicPy}`, this.URI).href);
        const data = await FetchJSON<APIResult<APIComicSingle>>(request);
        return new Manga(this, provider, data.data.comicInfo.comicPy, data.data.comicInfo.title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }
    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const request = new Request(new URL(`/api/v1/comic1/filter?page=${page}&size=100`, this.URI).href);
        const data = await FetchJSON<APIResult<APIComicList>>(request);
        return data.errno != 0 || !data.data.comicList ? [] : data.data.comicList.map(manga => new Manga(this, provider, manga.comic_py, manga.name.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(`/api/v1/comic1/comic/detail?comic_py=${manga.Identifier}`, this.URI).href);
        const data = await FetchJSON<APIResult<APIComicSingle>>(request);
        return data.errno != 0 ? [] : data.data.comicInfo.chapterList[0].data.map(chapter => new Chapter(this, manga, JSON.stringify({ comicId: data.data.comicInfo.id, chapterId: chapter.chapter_id }), chapter.chapter_title.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterId: ChapterID = JSON.parse(chapter.Identifier);
        const request = new Request(new URL(`/api/v1/comic1/chapter/detail?comic_id=${chapterId.comicId}&chapter_id=${chapterId.chapterId}`, this.URI).href);
        const data = await FetchJSON<APIResult<APIChapterInfo>>(request);
        return data.errno != 0 ? [] : (data.data.chapterInfo.page_url_hd || data.data.chapterInfo.page_url).map(page => new Page(this, chapter, new URL(page)));
    }
}