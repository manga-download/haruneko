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

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private apiUrl = 'https://api.ridibooks.com';

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
        const mangaList: Manga[] = [];
        let uri: URL | null = new URL('/v2/category/books', this.apiUrl);

        uri.search = new URLSearchParams({
            category_id: '1600',
            tab: 'books',
            platform: 'web',
            order_by: 'popular',
            limit: '60',
            offset: '0'
        }).toString();

        while (uri) {
            const { data: { items, pagination: { nextPage } } } = await FetchJSON<APIMangas>(new Request(uri));
            const mangas = items.map(({ book }) => {
                const title = book.serial?.title ? book.serial.title.trim() : book.title.trim();
                return new Manga(this, provider, book.bookId, title);
            });
            mangaList.push(...mangas);
            uri = nextPage && new URL(nextPage, this.apiUrl);
        }
        return mangaList.distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const data = await FetchWindowScript<ChapterID[]>(new Request(new URL(`/books/${manga.Identifier}`, this.URI)), 'seriesBookListJson');
        return data.map(({ id, title }) => new Chapter(this, manga, id, title.replace(manga.Title, '').trim() || title));
    }

    public override async GetChapterURL(chapter: Chapter): Promise<URL> {
        return new URL(`/books/${chapter.Identifier}/view`, this.URI);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { success, data: { pages } } = await FetchJSON<APIPages>(new Request(new URL('/api/web-viewer/generate', this.URI), {
            method: 'POST',
            body: JSON.stringify({
                book_id: chapter.Identifier
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }));
        return success ? pages.map(({ src }) => new Page(this, chapter, new URL(src))) : [];
    }
}