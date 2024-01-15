import { Tags } from '../Tags';
import icon from './WebNovel.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import * as Common from './decorators/Common';

type APIComic = {
    comicId: number,
    comicName: string
}

type APIResult<T> = {
    code: number,
    data: T,
    msg: string
}

type APIBooklist = {
    items: {
        bookId: string,
        bookName: string
    }[]
}

type APIChapterList = {
    comicChapters: {
        chapterId: string,
        chapterName: string,
        chapterIndex: number
    }[]
}

type APIPageList = {
    chapterInfo: {
        chapterPage: {
            url : string
        }[]
    }
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private token = '';

    public constructor() {
        super('webnovel', `Webnovel Comics`, 'https://www.webnovel.com', Tags.Language.English, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Official);
    }
    public override get Icon() {
        return icon;
    }
    public override async Initialize(): Promise<void> {
        const request = new Request(this.URI.href);
        const data = await FetchWindowScript<string>(request, `new Promise( resolve => resolve( decodeURIComponent( document.cookie ).match( /_csrfToken=([^;]+);/ )[1] ) )`);
        this.token = data;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/comic/\\S+_\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const request = new Request(url);
        const data = await FetchWindowScript<APIComic>(request, `new Promise( resolve => resolve( window.g_data.book.comicInfo));`);
        return new Manga(this, provider, data.comicId.toString(), data.comicName.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this._getMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }
    private async _getMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        page = page || 1;
        const uri = new URL('/go/pcm/category/categoryAjax', this.URI);
        const params = new URLSearchParams({
            pageIndex: String(page),
            _csrfToken: this.token,
            categoryId: '0',
            categoryType: '2',
        });
        uri.search = params.toString();
        const request = new Request(uri.href);
        const data = await FetchJSON<APIResult<APIBooklist>>(request);
        return data.code == 0 ? data.data.items.map(manga => new Manga(this, provider, manga.bookId, manga.bookName.trim())) : [];
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const uri = new URL('/go/pcm/comic/getChapterList', this.URI);
        const params = new URLSearchParams({
            _csrfToken: this.token,
            comicId: manga.Identifier
        });
        uri.search = params.toString();
        const request = new Request(uri.href);
        const data = await FetchJSON<APIResult<APIChapterList>>(request);
        return data.code == 0 ? data.data.comicChapters.map(chapter => new Chapter(this, manga, chapter.chapterId, chapter.chapterIndex + ' : ' + chapter.chapterName)) : [];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const uri = new URL('/go/pcm/comic/getContent', this.URI);
        const params = new URLSearchParams({
            width: '1920',
            _csrfToken: this.token,
            comicId: chapter.Parent.Identifier,
            chapterid: chapter.Identifier

        });
        uri.search = params.toString();
        const request = new Request(uri.href);
        const data = await FetchJSON<APIResult<APIPageList>>(request);
        return data.code == 0 ? data.data.chapterInfo.chapterPage.map(page => new Page(this, chapter, new URL(page.url))) : [];
    }
}