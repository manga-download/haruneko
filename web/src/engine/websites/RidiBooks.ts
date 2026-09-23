import { Tags } from '../Tags';
import icon from './RidiBooks.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type MangaPlugin, Manga, type Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIResult<T> = {
    data: T;
};

type APIMangas = APIResult<{
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
}>;

type APIPages = APIResult<{
    pages: {
        src: string;
    }[];
}>;

@Common.MangaCSS(/^{origin}\/books\/\d+$/, '#ISLANDS__Header h1')
@Common.ChaptersSinglePageJS(`seriesBookListJson.map(({ id, title }) => ({ id, title: title.replace(bookDetail.series_title, '').trim() || title })).reverse();`, 500)
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
        const uri = new URL('/v2/category/books?platform=web&tab=books&category_id=1600&order_by=popular&limit=200', this.apiURL);
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
        const { data: { pages} } = await FetchJSON<APIPages>(new Request(new URL('/api/web-viewer/generate', this.URI), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ book_id: chapter.Identifier }),
        }));
        return pages.map(({ src }) => new Page(this, chapter, new URL(src, this.URI)));
    }
}