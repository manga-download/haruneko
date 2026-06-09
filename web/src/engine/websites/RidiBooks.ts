import { Tags } from '../Tags';
import icon from './RidiBooks.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type APIMangas = {
    data: {
        items: APIManga[];
        pagination: {
            nextPage: string;
        };
    };
};

type APIManga = {
    book: {
        bookId: string;
        title: string;
        serial: {
            title: string;
        };
    };
};

type APIPages = {
    data: {
        pages: {
            src: string;
        }[];
    };
    success: boolean;
};

type ChapterID = {
    id: string;
    title: string;
};

type BookDetail = {
    series_id: string;
    series_title: string;
};

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {
    private readonly apiURL = 'https://api.ridibooks.com';

    public constructor() {
        super('ridibooks', 'RidiBooks', 'https://ridibooks.com', Tags.Media.Manhwa, Tags.Language.Korean, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/books/\\d+`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { series_id: id, series_title: title } = await FetchWindowScript<BookDetail>(new Request(url), 'bookDetail');
        return new Manga(this, provider, id, title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const perPage = 200;
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let offset = 0, run = true; run; offset += perPage) {
                const { data: { items, pagination: { nextPage } } } = await FetchJSON<APIMangas>(new Request(new URL(`./v2/category/books?category_id=1600&tab=books&platform=web&order_by=popular&limit=${perPage}&offset=${offset}`, this.apiURL)));
                const mangas = items.map(({ book: { bookId, serial, title } }) => new Manga(this, provider, bookId, (serial?.title ?? title).trim()));
                mangas.length > 0 ? yield* mangas : run = false;
                run = !!nextPage;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await FetchWindowScript<ChapterID[]>(new Request(new URL(`/books/${manga.Identifier}`, this.URI)), 'seriesBookListJson');
        return chapters.map(({ id, title }) => new Chapter(this, manga, id, title.replace(manga.Title, '').trim() || title.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { success, data } = await FetchJSON<APIPages>(new Request(new URL('/api/web-viewer/generate', this.URI), {
            method: 'POST',
            body: JSON.stringify({
                book_id: chapter.Identifier
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }));
        return success ? data.pages.map(page => new Page(this, chapter, new URL(page.src, this.URI))) : [];
    }
}