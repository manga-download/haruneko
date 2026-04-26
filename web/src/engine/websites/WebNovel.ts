import { Tags } from '../Tags';
import icon from './WebNovel.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import * as Common from './decorators/Common';

type APIComic = {
    comicId: number;
    comicName: string;
};

type APIResult<T> = {
    code: number;
    data: T;
};

type APIBooklist = APIResult<{
    items: {
        bookId: string;
        bookName: string;
    }[]
}>;

type APIChapterList = APIResult<{
    comicChapters: {
        chapterId: string;
        chapterName: string;
        chapterIndex: number;
    }[]
}>;

type APIPageList = APIResult<{
    comicInfo: APIComic;
    chapterInfo: {
        chapterName: string;
        chapterPage: {
            url: string;
        }[]
    }
}>;

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private token = '';

    public constructor() {
        super('webnovel', 'Webnovel Comics', 'https://www.webnovel.com', Tags.Language.English, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Official);
    }
    public override get Icon() {
        return icon;
    }
    public override async Initialize(): Promise<void> {
        this.token = await FetchWindowScript<string>(new Request(this.URI), 'decodeURIComponent(document.cookie.match( /_csrfToken=([^;]+);/ ).at(1));', 500);;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/comic/([^/]+_)?\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { comicId, comicName } = await FetchWindowScript<APIComic>(new Request(new URL(url)), 'window.g_data.book.comicInfo', 1500);
        return new Manga(this, provider, `${comicId}`, comicName);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { code, data: { items } } = await FetchJSON<APIBooklist>(new Request(new URL(`./go/pcm/category/categoryAjax?pageIndex=${page}&_csrfToken=${this.token}&categoryId=0&categoryType=2`, this.URI)));
                const mangas = code == 0 ? items.map(({ bookId, bookName }) => new Manga(this, provider, bookId, bookName)) : [];
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { code, data: { comicChapters } } = await FetchJSON<APIChapterList>(new Request(new URL(`./go/pcm/comic/getChapterList?_csrfToken=${this.token}&comicId=${manga.Identifier}`, this.URI)));
        return code == 0 ? comicChapters.map(({ chapterId, chapterIndex, chapterName }) => new Chapter(this, manga, chapterId, chapterIndex + ' : ' + chapterName)) : [];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { code, data: { chapterInfo: { chapterPage } } } = await FetchJSON<APIPageList>(new Request(new URL(`./go/pcm/comic/getContent?_csrfToken=${this.token}&comicId=${chapter.Parent.Identifier}&chapterId=${chapter.Identifier}&width=1920`, this.URI)));
        return code == 0 ? chapterPage.map(({ url }) => new Page(this, chapter, new URL(url))) : [];
    }

    public override async GetChapterURL(chapter: Chapter): Promise<URL> {
        return new URL(`/comic/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.URI);
    }
}