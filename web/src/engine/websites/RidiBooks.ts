import { Tags } from '../Tags';
import icon from './RidiBooks.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchRequest, FetchWindowScript } from '../FetchProvider';

type APIMangas = {
    data: {
        items: APIManga[]
        pagination: {
            nextPage: string,
        }
    }
}

type APIManga = {
    book: {
        bookId: string,
        title: string
        serial: {
            title: string
        }
    }
}

type APIPages = {
    data: {
        pages: {
            src: string
        }[]
    }
    success: boolean,

}

type ChapterID = {
    id: string,
    title: string
}

type BookDetail = {
    series_id: string,
    series_title: string
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
        return new RegExp(`^${this.URI.origin}/books/\\d+`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const data = await FetchWindowScript<BookDetail>(new FetchRequest(url), 'bookDetail');
        return new Manga(this, provider, data.series_id, data.series_title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList : Manga[] = [];
        let uri = new URL('/v2/category/books', this.apiUrl);

        uri.search = new URLSearchParams({
            category_id: '1600',
            tab: 'books',
            platform: 'web',
            order_by: 'popular',
            limit: '60',
            offset: '0'
        }).toString();

        while (uri) {
            const { data } = await FetchJSON<APIMangas>(new FetchRequest(uri.href));
            const mangas = data.items.map(({ book }) => {
                const title = book.serial?.title ? book.serial.title.trim() : book.title.trim();
                if (!book.serial) console.log(book.bookId);
                return new Manga(this, provider, book.bookId, title);
            });
            mangaList.push(...mangas);
            uri = data.pagination.nextPage && new URL(data.pagination.nextPage, this.apiUrl);
        }
        return mangaList.distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const uri = new URL(`/books/${manga.Identifier}`, this.URI);
        const data = await FetchWindowScript<ChapterID[]>(new FetchRequest(uri.href), 'seriesBookListJson');
        return data.map(chapter => {
            const title = chapter.title.replace(manga.Title, '').trim();
            return new Chapter(this, manga, chapter.id, title != '' ? title : chapter.title.trim());
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const uri = new URL('/api/web-viewer/generate', this.URI);
        const data = await FetchJSON<APIPages>(new FetchRequest(uri.href, {
            method: 'POST',
            body: JSON.stringify({
                book_id: chapter.Identifier
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }));
        if (!data.success) return [];
        return data.data.pages.map(page => new Page(this, chapter, new URL(page.src)));
    }
}