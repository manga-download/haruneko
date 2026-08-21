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
    }[];
}>;

type APIChapterList = APIResult<{
    comicChapters: {
        chapterId: string;
        chapterName: string;
        chapterIndex: number;
    }[];
}>;

type APIPageList = APIResult<{
    chapterInfo: {
        chapterPage: {
            url: string;
        }[];
    };
}>;

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    readonly #api = {
        token: '',
        uri: new URL('/go/pcm/', this.URI),
    };

    public constructor() {
        super('webnovel', 'Webnovel Comics', 'https://www.webnovel.com', Tags.Language.English, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.#api.token = await FetchWindowScript<string>(new Request(this.URI), `cookieStore.get('_csrfToken').then(({ value }) => decodeURIComponent( value ) ?? null).catch(error => null);`, 500);
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
                const { code, data: { items } } = await this.FetchAPI<APIBooklist>(`./category/categoryAjax?pageIndex=${page}&categoryId=0&categoryType=2`);
                const mangas = code == 0 ? items.map(({ bookId, bookName }) => new Manga(this, provider, bookId, bookName)) : [];
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { code, data } = await this.FetchAPI<APIChapterList>(`./comic/getChapterList?&comicId=${manga.Identifier}`);
        return code == 0 ? data.comicChapters.map(({ chapterId, chapterIndex, chapterName }) => new Chapter(this, manga, chapterId, [chapterIndex, '-', chapterName].joinTitleSegments())) : [];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { code, data } = await this.FetchAPI<APIPageList>(`./comic/getContent?&comicId=${chapter.Parent.Identifier}&chapterId=${chapter.Identifier}&width=1920`);
        return code == 0 ? data.chapterInfo.chapterPage.map(({ url }) => new Page(this, chapter, new URL(url))) : [];
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string) {
        const uri = new URL(endpoint, this.#api.uri);
        uri.searchParams.set('_csrfToken', this.#api.token);
        return FetchJSON<T>(new Request(uri));
    }
}