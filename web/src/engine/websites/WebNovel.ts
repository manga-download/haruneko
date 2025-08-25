import { Tags } from '../Tags';
import icon from './WebNovel.webp';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIComic = {
    comicId: number;
    comicName: string;
};

type APIResult<T> = {
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

    private readonly api = {
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
        this.api.token = await FetchWindowScript<string>(new Request(this.URI), `cookieStore.get('_csrfToken').then(({ value }) => decodeURIComponent(value));`, 500);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/comic/([^/]+_)?\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { comicId, comicName } = await FetchWindowScript<APIComic>(new Request(url), 'window.g_data.book.comicInfo;', 750);
        return new Manga(this, provider, `${comicId}`, comicName);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        const categories = [ '60002' ];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const { data: { items } } = await this.FetchAPI<APIBooklist>('./category/categoryAjax', { categoryId: '0', categoryType: '2', pageIndex: `${page}` });
        return items.map(({ bookId, bookName }) => new Manga(this, provider, bookId, bookName));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data: { comicChapters } } = await this.FetchAPI<APIChapterList>('./comic/getChapterList', { comicId: manga.Identifier });
        return comicChapters.map(({ chapterId, chapterName }) => new Chapter(this, manga, chapterId, chapterName));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { data: { chapterInfo: { chapterPage } } } = await this.FetchAPI<APIPageList>('./comic/getContent', { comicId: chapter.Parent.Identifier, chapterId: chapter.Identifier, width: '1920' });
        return chapterPage.map(({ url }) => new Page(this, chapter, new URL(url)));
    }

    private async FetchAPI<T extends JSONElement>(path: string, searchParamInit: Record<string, string>) {
        const uri = new URL(path, this.api.uri);
        uri.search = new URLSearchParams({ _csrfToken: this.api.token, ...searchParamInit }).toString();
        return FetchJSON<T>(new Request(uri));
    }
}