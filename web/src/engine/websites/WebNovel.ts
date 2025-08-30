import { Tags } from '../Tags';
import icon from './WebNovel.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import * as Common from './decorators/Common';

type APIComic = {
    comicId: number,
    comicName: string
};

type APIResult<T> = {
    code: number,
    data: T,
};

type APIBooklist = APIResult<{
    items: {
        bookId: string,
        bookName: string
    }[]
}>;

type APIChapterList = APIResult<{
    comicChapters: {
        chapterId: string,
        chapterName: string,
        chapterIndex: number
    }[]
}>;

type APIPageList = APIResult<{
    chapterInfo: {
        chapterPage: {
            url: string
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
        const data = await FetchWindowScript<string>(new Request(this.URI), 'decodeURIComponent(document.cookie.match( /_csrfToken=([^;]+);/ ).at(1));', 500);
        this.token = data;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/comic/([^/]+_)?\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { comicId, comicName } = await FetchWindowScript<APIComic>(new Request(new URL(url)), 'window.g_data.book.comicInfo', 1500 );
        return new Manga(this, provider, comicId.toString(), comicName);
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
        const uri = new URL(`./go/pcm/category/categoryAjax?pageIndex=${page}&_csrfToken=${this.token}&categoryId=0&categoryType=2`, this.URI);
        const data = await FetchJSON<APIBooklist>(new Request(uri));
        return data.code == 0 ? data.data.items.map(({ bookId, bookName }) => new Manga(this, provider, bookId, bookName)) : [];
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const uri = new URL(`./go/pcm/comic/getChapterList?_csrfToken=${this.token}&comicId=${manga.Identifier}`, this.URI);
        const data = await FetchJSON<APIChapterList>(new Request(uri));
        return data.code == 0 ? data.data.comicChapters.map(({ chapterId, chapterIndex, chapterName }) => new Chapter(this, manga, chapterId, chapterIndex + ' : ' + chapterName)) : [];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const uri = new URL(`./go/pcm/comic/getContent?_csrfToken=${this.token}&comicId=${chapter.Parent.Identifier}&chapterId=${chapter.Identifier}&width=1920`, this.URI);
        const data = await FetchJSON<APIPageList>(new Request(uri));
        return data.code == 0 ? data.data.chapterInfo.chapterPage.map(({ url }) => new Page(this, chapter, new URL(url))) : [];
    }
}