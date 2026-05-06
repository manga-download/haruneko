import { Tags } from '../Tags';
import icon from './Kagane.webp';
import type { Priority } from '../taskpool/DeferredTask';
import { Delay } from '../BackgroundTimers';
import { Fetch, FetchJSON } from '../platform/FetchProvider';
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

@Common.MangaCSS(
    /^{origin}\/series\/[0-9a-zA-Z-]+(#[^/]*)?$/,
    'h1',
    (element, uri) => ({
        id: uri.pathname.split('/').at(-1),
        title: element.textContent?.trim() ?? '',
    })
)
export default class extends DecoratableMangaScraper {

    readonly #drm = new DRMProvider();

    readonly #apiURL = 'https://yuzuki.kagane.org/api/v2/';

    public constructor() {
        super(
            'kagane', 'Kagane', 'https://kagane.org',
            Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua,
            Tags.Language.English, Tags.Source.Aggregator,
            ...Tags.Rating.toArray()
        );
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const uri = new URL(`./series/${manga.Identifier}`, this.#apiURL);
        const { series_books } = await FetchJSON<APIChapters>(new Request(uri));

        return series_books.map(book => {
            const title = book.title ?? `Chapter ${book.chapter_no}`;
            return new Chapter(this, manga, book.book_id, title);
        });
    }

    public override FetchMangas(provider: MangaPlugin): Promise<Manga[]> {

        type APIMangas = {
            content: {
                series_id: string;
                title: string;
            }[];
            total_pages: number;
        };

        // All meaningful sort strategies to maximize coverage past the 1000-result cap
        const sortStrategies = [
            'avg_views_today,desc',
            'avg_views_today,asc',
            'avg_views_week,desc',
            'avg_views_week,asc',
            'avg_views_month,desc',
            'avg_views_month,asc',
            'total_views,desc',
            'total_views,asc',
            'relevance,desc',
            'relevance,asc',
            'updated_at,desc',
            'updated_at,asc',
            'added_at,desc',
            'added_at,asc',
            'series_name,desc',
            'series_name,asc',
            'books_count,desc',
            'books_count,asc',
            'created_at,desc',
            'created_at,asc',
        ];

        const uri = new URL('./search/series', this.#apiURL);
        const body = JSON.stringify({
            content_rating: ['Safe', 'Suggestive', 'Erotica', 'Pornographic'],
        });

        return Array.fromAsync(async function* () {
            const seen = new Set<string>();

            for (const sort of sortStrategies) {
                uri.search = new URLSearchParams({ size: '100', sort }).toString();

                for (let page = 0, run = true; run; page++) {
                    uri.searchParams.set('page', `${page}`);

                    const data = await FetchJSON<APIMangas>(new Request(uri, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body,
                    }));

                    for (const { series_id, title } of data.content) {
                        if (!seen.has(series_id)) {
                            seen.add(series_id);
                            yield new Manga(this, provider, series_id, title);
                        }
                    }

                    run = page + 1 < data.total_pages;
                    if (run) {
                        await Delay(200);
                    }
                }

                // Small pause between sort strategies to be polite to the API
                await Delay(500);
            }
        }.call(this));
    }
    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const mangaId = chapter.Parent.Identifier;
        const chapterId = chapter.Identifier;

        const tokenEndpoint = new URL(
            `./books/${chapterId}`,
            this.#apiURL
        );
        tokenEndpoint.searchParams.set('is_datasaver', 'false');

        const pages = await this.#drm.CreateImageURL(
            tokenEndpoint.toString(),
            mangaId,
            chapterId
        );

        return pages.map(({ link, parameters }) =>
            new Page<PageParameters>(this, chapter, link, parameters)
        );
    }

    public override async FetchImage(
        page: Page<PageParameters>,
        priority: Priority,
        signal: AbortSignal
    ): Promise<Blob> {
        const bytes = await this.imageTaskPool.Add(async () => {
            const response = await Fetch(new Request(page.Link, { signal }));
            return response.arrayBuffer();
        }, priority, signal);

        return this.#drm.DecryptImage(bytes);
    }
}