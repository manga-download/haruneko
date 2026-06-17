import { Tags } from '../Tags';
import icon from './RidiBooks.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type MangaPlugin, Manga, type Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIMangas = {
    data: {
        items: {
            book: {
                bookId: string;
                title: string;
                serial: {
                    title: string;
                };
            };
        }[];
        pagination: {
            nextPage: string;
        };
    };
};

type APIPages = {
    data: {
        pages: {
            src: string;
        }[];
    };
};

@Common.MangaCSS(/^{origin}\/books\/\d+$/, '#ISLANDS__Header h1')
@Common.ChaptersSinglePageJS(`seriesBookListJson.map(({ id, title }) => ({ id, title: title.replace(bookDetail.series_title, '').trim() || title }));`)
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://api.ridibooks.com';

    public constructor() {
        super('ridibooks', 'RidiBooks', 'https://ridibooks.com', Tags.Media.Manhwa, Tags.Language.Korean, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        const uri = new URL('/v2/category/books', this.apiURL);
        uri.search = new URLSearchParams({
            'platform': 'web',
            'tab': 'books',
            'category_id': '1600',
            'order_by': 'popular',
            'limit': '200',
        }).toString();
        return Array.fromAsync(async function* (this: This) {
            for (let offset = 0, run = true; run; offset += 200) {
                uri.searchParams.set('offset', `${offset}`);
                const { data: { items, pagination: { nextPage } } } = await FetchJSON<APIMangas>(new Request(uri));
                yield* items.map(({ book: { bookId, serial, title } }) => new Manga(this, provider, `/books/${bookId}`, (serial?.title ?? title).trim()));
                run = !!nextPage;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { data } = await FetchJSON<APIPages>(new Request(new URL('/api/web-viewer/generate', this.URI), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ book_id: chapter.Identifier }),
        }));
        return data.pages.map(page => new Page(this, chapter, new URL(page.src, this.URI)));
    }
}