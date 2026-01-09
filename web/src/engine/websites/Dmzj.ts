import { Tags } from '../Tags';
import icon from './Dmzj.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIResult<T> = {
    errno: number;
    errmsg: string;
    data: T;
};

type APIComicList = {
    comicList: APIManga[];
};

type APIComicSingle = {
    comicInfo: APIManga;
};

type APIChapterInfo = {
    chapterInfo: APIChapter;
};

type APIManga = {
    id: number;
    name: string;
    title: string;
    comicPy: string;
    comic_py: string; //yes api is dumb like that
    chapterList: APIChapter[];
};

type APIChapter = {
    title: string;
    data: {
        chapter_id: number;
        chapter_title: string;
    }[];
    page_url_hd?: string[];
    page_url: string[];
};

type ChapterID = {
    comicId: number;
    chapterId: number;
};

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://www.idmzj.com/api/v1/comic1/';

    public constructor() {
        super('dmzj', `动漫之家(DMZJ)`, 'https://www.idmzj.com', Tags.Language.Chinese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string) {
        return new RegExpSafe(`^${this.URI.origin}/info/\[^/]+.html$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { data: { comicInfo: { comicPy, title } } } = await FetchJSON<APIResult<APIComicSingle>>(new Request(new URL(`./comic/detail?comic_py=${url.match(/\/info\/([^/]+)\.html$/).at(1)}`, this.apiUrl)));
        return new Manga(this, provider, comicPy, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data: { comicList }, errno } = await FetchJSON<APIResult<APIComicList>>(new Request(new URL(`./filter?page=${page}&size=100`, this.apiUrl)));
                const mangas = errno != 0 || !comicList ? [] : comicList.map(({ comic_py: mangaId, name }) => new Manga(this, provider, mangaId, name));
                mangas.length > 0 ? yield* mangas : run = false;
            }

        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data: { comicInfo: { chapterList, id } }, errno } = await FetchJSON<APIResult<APIComicSingle>>(new Request(new URL(`./comic/detail?comic_py=${manga.Identifier}`, this.apiUrl)));
        return errno != 0 ? [] : chapterList[0].data.map(({ chapter_id: chapterId, chapter_title: chapterTitle }) => new Chapter(this, manga, JSON.stringify({ comicId: id, chapterId }), chapterTitle));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { comicId, chapterId }: ChapterID = JSON.parse(chapter.Identifier);
        const { data: { chapterInfo: { page_url_hd, page_url } }, errno } = await FetchJSON<APIResult<APIChapterInfo>>(new Request(new URL(`./chapter/detail?comic_id=${comicId}&chapter_id=${chapterId}`, this.apiUrl)));
        return errno != 0 ? [] : (page_url_hd || page_url).map(page => new Page(this, chapter, new URL(page)));
    }
}