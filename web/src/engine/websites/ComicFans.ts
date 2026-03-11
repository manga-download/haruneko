import { Tags } from '../Tags';
import icon from './ComicFans.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIPagedResult<T> = {
    data: {
        list: T;
    };
};

type APIResult<T> = {
    data: T;
};

type APIManga = {
    id: number,
    title: string;
};

type APIChapter = {
    id: number,
    title: string,
    chapterOrder: number;
};

type APIPages = {
    data: {
        comicImageList: {
            imageUrl: string;
        }[];
    };
};

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
        const mangaid = url.match(/\/comic\/(\d+)/).at(-1);
        const { data: { id, title } } = await FetchJSON<APIResult<APIManga>>(new Request(new URL(`./books/${mangaid}`, this.apiUrl)));
        return new Manga(this, provider, `${id}`, title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { data: { list } } = await FetchJSON<APIPagedResult<APIManga[]>>(new Request(new URL('./books?&pageNumber=1&pageSize=9999', this.apiUrl)));
        return list.map(({ id, title }) => new Manga(this, provider, `${id}`, title.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        type This = typeof this;
        const url = new URL(`./chapters/page?sortDirection=ASC&bookId=${manga.Identifier}&pageSize=100`, this.apiUrl);
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                url.searchParams.set('pageNumber', `${page}`);
                const { data: { list } } = await FetchJSON<APIPagedResult<APIChapter[]>>(new Request(url));
                const chapters = list.map(chapter => new Chapter(this, manga, chapter.id.toString(), [chapter.chapterOrder, chapter.title.trim()].join(' - ')));
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const url = new URL(`chapters/${chapter.Identifier}`, this.apiUrl);
        const { data: { comicImageList } } = await FetchJSON<APIPages>(new Request(url));
        return comicImageList.map(page => new Page(this, chapter, new URL(page.imageUrl, this.cdnUrl)));
    }
}