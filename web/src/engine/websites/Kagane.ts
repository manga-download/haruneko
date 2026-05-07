import { Tags } from '../Tags';
import icon from './Kagane.webp';
import type { Priority } from '../taskpool/DeferredTask';
import { Delay } from '../BackgroundTimers';
import { FetchJSON } from '../platform/FetchProvider';
import { DecoratableMangaScraper, Manga, Chapter, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

import { DRMProvider, type PageParameters } from './Kagane.DRM';

type APIBooks = {
    book_id: string;
    chapter_no: string;
    title?: string;
};

type APIChapters = {
    series_books: APIBooks[]
};

@Common.MangaCSS(/^{origin}\/series\/[0-9a-zA-Z-]+(#[^/]*)?$/, 'h1', (element, uri) => ({id: uri.pathname.split('/').at(-1), title: element.textContent?.trim() ?? '', }))
export default class extends DecoratableMangaScraper {

    readonly #drm = new DRMProvider();
    readonly #apiURL = 'https://yuzuki.kagane.org/api/v2/';

    public constructor() {
        super('kagane', 'Kagane', 'https://kagane.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator, ...Tags.Rating.toArray());
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type APIMangas = {
            content: {
                series_id: string;
                title: string;
            }[];
            total_pages: number;
        };
        const uri = new URL('./search/series', this.#apiURL);
        uri.search = new URLSearchParams({ size: '100', sort: 'updated_at,desc' }).toString();
        const body = JSON.stringify({ content_rating: ['Safe', 'Suggestive', 'Erotica'] }); // Removed 'Pornographic' as it was always returning that kind of content.
        return await Array.fromAsync(async function* () {
            for (let page = 0; ; page++) {
                uri.searchParams.set('page', String(page));
                const data = await FetchJSON<APIMangas>(new Request(uri, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body }));
                if (!data.content.length) break;
                for (const { series_id, title } of data.content) {
                    yield new Manga(this, provider, series_id, title);
                }
                if (page + 1 >= data.total_pages) break;
                await Delay(700);
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const uri = new URL(`./series/${manga.Identifier}`, this.#apiURL);
        const { series_books } = await FetchJSON<APIChapters>(new Request(uri));
        return series_books.map(({ book_id: bookId, title, chapter_no: chapterNo }) => new Chapter(this, manga, bookId, title ?? `Chapter ${chapterNo}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const chapterId = chapter.Identifier;
        const tokenEndpoint = new URL(`./books/${chapterId}`, this.#apiURL);
        tokenEndpoint.searchParams.set('is_datasaver', 'false');
        const pages = await this.#drm.CreateImageURL(tokenEndpoint.toString(), chapter.Parent.Identifier, chapterId);
        return pages.map(({ link, parameters }) => new Page<PageParameters>(this, chapter, link, parameters));
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        return this.#drm.DecryptImage(await blob.arrayBuffer());
    }
}