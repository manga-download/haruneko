import { Tags } from '../Tags';
import icon from './Dmzj.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIResult<T> = {
    errno: number;
    data: T;
};

type APIManga = APIResult<{
    comicInfo: {
        title: string;
    };
}>;

type APIMangas = APIResult<{
    comicList: {
        id: number;
        name: string;
        title: string;
        comic_py: string;
    }[];
}>;

type APIChapters = APIResult<{
    comicInfo: {
        id: number;
        chapterList: {
            data: {
                chapter_id: number;
                chapter_title: string;
            }[];
        }[];
    };
}>;

type APIPages = APIResult<{
    chapterInfo: {
        page_url_hd?: string[];
        page_url: string[];
    }
}>;

type ChapterID = {
    comicId: number;
    chapterId: number;
};

//TODO: @Common.MangaCSS(/-/, '...', (element, uri) => ({ id: uri.pathname.split('/').at(-1).replace('.html', ''), title: '...'}))
@Common.ImageAjax(true)
export default class Scraper extends DecoratableMangaScraper {

    private readonly apiURL = 'https://www.idmzj.com/api/v1/comic1/';

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
        const id = url.match(/\/info\/([^/]+)\.html$/).at(1);
        const { data: { comicInfo: { title } } } = await FetchJSON<APIManga>(new Request(new URL(`./comic/detail?comic_py=${id}`, this.apiURL)));
        return new Manga(this, provider, id, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data: { comicList }, errno } = await FetchJSON<APIMangas>(new Request(new URL(`./filter?page=${page}&size=100`, this.apiURL)));
                const mangas = errno !== 0 || !comicList ? [] : comicList.map(({ comic_py: id, name }) => new Manga(this, provider, id, name));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data: { comicInfo: { chapterList, id } }, errno } = await FetchJSON<APIChapters>(new Request(new URL(`./comic/detail?comic_py=${manga.Identifier}`, this.apiURL)));
        return errno !== 0 ? [] : chapterList[0].data.map(({ chapter_id: chapterId, chapter_title: chapterTitle }) => new Chapter(this, manga, JSON.stringify({ comicId: id, chapterId }), chapterTitle));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { comicId, chapterId }: ChapterID = JSON.parse(chapter.Identifier);
        const { data: { chapterInfo: { page_url_hd, page_url } } } = await FetchJSON<APIPages>(new Request(new URL(`./chapter/detail?comic_id=${comicId}&chapter_id=${chapterId}`, this.apiURL)));
        return (page_url_hd || page_url).map(page => new Page(this, chapter, new URL(page)));
    }
}