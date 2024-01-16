import { WebsiteResourceKey as R } from '../../../i18n/ILocale';
import { Exception, InternalError } from '../../Error';
import { Fetch, FetchCSS, FetchWindowScript } from '../../platform/FetchProvider';
import { type MangaScraper, type DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../../providers/MangaPlugin';
import type { MediaChild, MediaContainer } from '../../providers/MediaPlugin';
import type { Priority } from '../../taskpool/TaskPool';
import DeProxify from '../../transformers/ImageLinkDeProxifier';

export function ThrowOnUnsupportedDecoratorContext(context: ClassDecoratorContext) {
    if (context && context.kind !== 'class') {
        throw new InternalError(`Inalid decorator context: ${context.name}`);
    }
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */ //=> A mixin class must have a constructor with a single rest parameter of type 'any[]'
export type Constructor = new (...args: any[]) => DecoratableMangaScraper;

type LabelExtractor = (this: MangaScraper, element: HTMLElement) => string;
type InfoExtractor<E extends HTMLElement> = (this: MangaScraper, element: E) => { id: string, title: string };

/**
 * The pre-defined default label extractor that will parse the media title from a given {@link HTMLElement}.
 * In case of an {@link HTMLMetaElement} the media title will be extracted from the `content` attribute, otherwise the `textContent` of the element will be used as media title.
 */
const DefaultLabelExtractor = ElementLabelExtractor();

/**
 * Creates an label extractor that will parse the media title from an {@link HTMLElement}.
 * In case of an {@link HTMLMetaElement} the media title will be extracted from the `content` attribute, otherwise the `textContent` of the element will be used as media title.
 * @param queryBloat - An optional CSS query which can be used to remove all matching child elements before extracting the media title
 */
export function ElementLabelExtractor(queryBloat: string = undefined) {
    return function (this: MangaScraper, element: HTMLElement) {
        if (queryBloat) {
            for (const bloat of element.querySelectorAll(queryBloat)) {
                if (bloat.parentElement) {
                    bloat.parentElement.removeChild(bloat);
                }
            }
        }
        return element instanceof HTMLMetaElement ? element.content : element.textContent.trim();
    };
}

/**
 * The pre-defined default info extractor that will parse the media id and media title from a given {@link HTMLAnchorElement}.
 * The media title will be extracted from the `text` porperty of the element.
 */
const DefaultInfoExtractor = AnchorInfoExtractor();

/**
 * Creates an info extractor that will parse the media id and media title from an {@link HTMLAnchorElement}.
 * @param useTitleAttribute - If set to `true`, the media title will be extracted from the `title` attribute of the element, otherwise the `text` porperty of the element will be used as media title
 * @param queryBloat - An optional CSS query which can be used to remove all matching child elements before extracting the media title
 */
export function AnchorInfoExtractor(useTitleAttribute = false, queryBloat: string = undefined): InfoExtractor<HTMLElement> {
    return function (this: MangaScraper, element: HTMLAnchorElement) {
        if (!useTitleAttribute && queryBloat) {
            for (const bloat of element.querySelectorAll(queryBloat)) {
                if (bloat.parentElement) {
                    bloat.parentElement.removeChild(bloat);
                }
            }
        }
        return {
            id: element.pathname,
            title: useTitleAttribute ? element.title.trim() : element.text.trim()
        };
    };
}

type PageLinkExtractor<E extends HTMLElement> = (this: MangaScraper, element: E) => string;

function DefaultPageLinkExtractor<E extends HTMLImageElement>(this: MangaScraper, element: E): string {
    return element.dataset.src || element.getAttribute('src') || ''; // TODO: Throw if none found?
}

function GetParentReferer(item: MediaContainer<MediaChild>, base: URL): URL {
    try {
        return new URL(item.Parent?.Identifier ?? '', base);
    } catch {
        return base;
    }
}

/***************************************************
 ******** Manga from URL Extraction Methods ********
 ***************************************************/

/**
 * An extension method for extracting a single manga from the given {@link url} using the given CSS {@link query}.
 * The `pathname`and the `search` of the given {@link url} will be used as identifier for the extracted manga.
 * When the CSS {@link query} matches a `meta` element, the manga title will be extracted from its `content` attribute, otherwise the `textContent` of the element will be used as manga title.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param provider - A reference to the {@link MangaPlugin} which shall be assigned as parent for the extracted manga
 * @param url - The url from which the manga shall be extracted
 * @param query - A CSS query to locate the element from which the manga title shall be extracted
 * @param extract - An Extractor to get manga infos
 * @param includeSearch - append Uri.search to the manga identifier
 * @param includeHash - append Uri.hash to the manga identifier

 */
export async function FetchMangaCSS(this: MangaScraper, provider: MangaPlugin, url: string, query: string, extract = DefaultLabelExtractor as LabelExtractor, includeSearch = false, includeHash = false): Promise<Manga> {
    const uri = new URL(url);
    const request = new Request(uri.href, {
        headers: {
            Referer: uri.href
        }
    });
    const data = (await FetchCSS<HTMLElement>(request, query)).shift();
    let id = uri.pathname;
    id += includeSearch ? uri.search : '';
    id += includeHash ? uri.hash : '';
    return new Manga(this, provider, id, extract.call(this, data));
}

/**
 * A class decorator that adds the ability to extract a manga using the given CSS {@link query} from any url that matches the given {@link pattern}.
 * The `pathname` of the url will be used as identifier for the extracted manga.
 * When the CSS {@link query} matches a `meta` element, the manga title will be extracted from its `content` attribute, otherwise the `textContent` of the element will be used as manga title.
 * @param pattern - An expression to check if a manga can be extracted from an url or not, it may contain the placeholders `{origin}` and `{hostname}` which will be replaced with the corresponding parameters based on the website's base URL
 * @param query - A CSS query to locate the element from which the manga title shall be extracted
 * @param includeSearch - append Uri.search to the manga identifier
 * @param includeHash - append Uri.hash to the manga identifier
 */
export function MangaCSS(pattern: RegExp, query: string, extract = DefaultLabelExtractor as LabelExtractor, includeSearch = false, includeHash = false) {
    return function DecorateClass<T extends Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public ValidateMangaURL(this: MangaScraper, url: string): boolean {
                const source = pattern.source.replaceAll('{origin}', this.URI.origin).replaceAll('{hostname}', this.URI.hostname);
                return new RegExp(source, pattern.flags).test(url);
            }
            public async FetchManga(this: MangaScraper, provider: MangaPlugin, url: string): Promise<Manga> {
                return FetchMangaCSS.call(this, provider, url, query, extract, includeSearch, includeHash);
            }
        };
    };
}

/***********************************************
 ******** Manga List Extraction Methods ********
 ***********************************************/

export function EndsWith(target: Manga[], source: Manga[]) {
    if (target.length < source.length) {
        return false;
    }
    /*
    for(let index = 1; index <= source.length; index++) {
        if(target[target.length - index].Identifier !== source[source.length - index].Identifier) {
            return false;
        }
    }
    return true;
    */
    return target[target.length - 1].Identifier === source[source.length - 1].Identifier;
}

/**
 * An extension method that throws an error ... .
 */
export async function FetchMangasNotSupported(): Promise<Manga[]> {
    throw new Exception(R.Plugin_Common_MangaIndex_NotSupported);
}

/**
 * A class decorator that throws an error ... .
 */
export function MangasNotSupported() {
    return function DecorateClass<T extends Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchMangas(this: MangaScraper): Promise<Manga[]> {
                return FetchMangasNotSupported();
            }
        };
    };
}

/**
 * An extension method for extracting multiple mangas from the given relative {@link path} using the given CSS {@link query}.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param provider - A reference to the {@link MangaPlugin} which shall be assigned as parent for the extracted mangas
 * @param path - The path relative to {@link this} scraper's base url from which the mangas shall be extracted
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 * @param extract - A function to extract the manga identifier and title from a single element (found with {@link query})
 */
export async function FetchMangasSinglePageCSS<E extends HTMLElement>(this: MangaScraper, provider: MangaPlugin, path: string, query: string, extract = DefaultInfoExtractor as InfoExtractor<E>): Promise<Manga[]> {
    const uri = new URL(path, this.URI);
    const request = new Request(uri.href, {
        headers: {
            Referer: this.URI.href
        }
    });
    const data = await FetchCSS<E>(request, query);
    return data.map(element => {
        const { id, title } = extract.call(this, element);
        return new Manga(this, provider, id, title);
    }).distinct();
}

/**
 * A class decorator that adds the ability to extract multiple mangas from the given relative {@link path} using the given CSS {@link query}.
 * @param path - The path relative to the scraper's base url from which the mangas shall be extracted
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 * @param extract - A function to extract the manga identifier and title from a single element (found with {@link query})
 */
export function MangasSinglePageCSS<E extends HTMLElement>(path: string, query: string, extract = DefaultInfoExtractor as InfoExtractor<E>) {
    return function DecorateClass<T extends Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchMangas(this: MangaScraper, provider: MangaPlugin): Promise<Manga[]> {
                return FetchMangasSinglePageCSS.call(this, provider, path, query, extract as InfoExtractor<HTMLElement>);
            }
        };
    };
}

/**
 * An extension method for extracting multiple mangas from a range of given relative {@link path} patterns using the given CSS {@link query}.
 * The range of all {@link path} patterns begins with {@link start} and is incremented by {@link step} until no more new mangas can be extracted.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param provider - A reference to the {@link MangaPlugin} which shall be assigned as parent for the extracted mangas
 * @param path - The path pattern relative to {@link this} scraper's base url from which the mangas shall be extracted containing the placeholder `{page}` which is replaced by an incrementing number
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 * @param start - The start for the sequence of incremental numbers which are applied to the {@link path} pattern
 * @param step - An int that will be used to increase page on each loop, so page can be used as an offset if needed
 * @param throttle - A delay [ms] for each request (only required for rate-limited websites)
 * @param extract - A function to extract the manga identifier and title from a single element (found with {@link query})
 */
export async function FetchMangasMultiPageCSS<E extends HTMLElement>(this: MangaScraper, provider: MangaPlugin, path: string, query: string, start = 1, step = 1, throttle = 0, extract = DefaultInfoExtractor as InfoExtractor<E>): Promise<Manga[]> {
    const mangaList: Manga[] = [];
    let reducer = Promise.resolve();
    for (let page = start, run = true; run; page += step) {
        await reducer;
        reducer = throttle > 0 ? new Promise(resolve => setTimeout(resolve, throttle)) : Promise.resolve();
        const mangas = await FetchMangasSinglePageCSS.call(this, provider, path.replace('{page}', `${page}`), query, extract as InfoExtractor<HTMLElement>);
        // Always add when mangaList is empty ... (length = 0)
        mangas.length > 0 && !EndsWith(mangaList, mangas) ? mangaList.push(...mangas) : run = false;
        // TODO: Broadcast event that mangalist for provider has been updated?
    }
    return mangaList.distinct();
}

/**
 * A class decorator that adds the ability to extract multiple mangas from a range of given relative {@link path} patterns using the given CSS {@link query}.
 * The range of all {@link path} patterns begins with {@link start} and is incremented by {@link step} until no more new mangas can be extracted.
 * @param path - The path pattern relative to the scraper's base url from which the mangas shall be extracted containing the placeholder `{page}` which is replaced by an incrementing number
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 * @param start - The start for the sequence of incremental numbers which are applied to the {@link path} pattern
 * @param step - An int that will be used to increase page on each loop, so page can be used as an offset if needed
 * @param throttle - A delay [ms] for each request (only required for rate-limited websites)
 * @param extract - A function to extract the manga identifier and title from a single element (found with {@link query})
 */
export function MangasMultiPageCSS<E extends HTMLElement>(path: string, query: string, start = 1, step = 1, throttle = 0, extract = DefaultInfoExtractor as InfoExtractor<E>) {
    return function DecorateClass<T extends Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchMangas(this: MangaScraper, provider: MangaPlugin): Promise<Manga[]> {
                return FetchMangasMultiPageCSS.call(this, provider, path, query, start, step, throttle, extract as InfoExtractor<HTMLElement>);
            }
        };
    };
}

/*************************************************
 ******** Chapter List Extraction Methods ********
 *************************************************/

/**
 * An extension method for extracting all chapters for the given {@link manga} using the given CSS {@link query}.
 * The chapters are extracted from the composed url based on the `Identifier` of the {@link manga} and the `URI` of the website.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param manga - A reference to the {@link Manga} which shall be assigned as parent for the extracted chapters
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 * @param extract - A function to extract the chapter identifier and title from a single element (found with {@link query})
 */
export async function FetchChaptersSinglePageCSS<E extends HTMLElement>(this: MangaScraper, manga: Manga, query: string, extract = DefaultInfoExtractor as InfoExtractor<E>): Promise<Chapter[]> {
    const uri = new URL(manga.Identifier, this.URI);
    const request = new Request(uri.href, {
        headers: {
            Referer: this.URI.href
        }
    });
    const data = await FetchCSS<E>(request, query);
    return data.map(element => {
        const { id, title } = extract.call(this, element);
        return new Chapter(this, manga, id, title.replace(manga.Title, '').trim() || manga.Title);
    }).distinct();
}

/**
 * A class decorator that adds the ability to extract all chapters for a given manga from this website using the given CSS {@link query}.
 * The chapters are extracted from the composed url based on the `Identifier` of the manga and the `URI` of the website.
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 * @param extract - A function to extract the chapter identifier and title from a single element (found with {@link query})
 */
export function ChaptersSinglePageCSS<E extends HTMLElement>(query: string, extract = DefaultInfoExtractor as InfoExtractor<E>) {
    return function DecorateClass<T extends Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersSinglePageCSS.call(this, manga, query, extract as InfoExtractor<HTMLElement>);
            }
        };
    };
}

/**
 * An extension method for extracting all chapters for the given {@link manga} using the given JS {@link script}.
 * The chapters are extracted from the composed url based on the `Identifier` of the {@link manga} and the `URI` of the website.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param manga - A reference to the {@link Manga} which shall be assigned as parent for the extracted chapters
 * @param script - A JS script to extract a list of entries with each entry containing the identifier and title property from which the chapters are composed
 * @param delay - An initial delay [ms] before the {@link script} is executed
 */
export async function FetchChaptersSinglePageJS(this: MangaScraper, manga: Manga, script: string, delay = 0): Promise<Chapter[]> {
    const uri = new URL(manga.Identifier, this.URI);
    const request = new Request(uri.href, {
        headers: {
            Referer: this.URI.href
        }
    });
    const data = await FetchWindowScript<{ id: string, title: string }[]>(request, script, delay);
    // NOTE: The Array prototype of `data` comes from a different window context and therefore is missing prototype extensions made for Array in this window context
    //       => Spread `data` into a new Array
    return [ ...data ].map(entry => {
        return new Chapter(this, manga, entry.id, entry.title.replace(manga.Title, '').trim() || manga.Title);
    }).distinct();
}

/**
 * A class decorator that adds the ability to extract all chapters for a given manga from this website using the given JS {@link script}.
 * The chapters are extracted from the composed url based on the `Identifier` of the manga and the `URI` of the website.
 * @param script - A JS script to extract a list of entries with each entry containing the identifier and title property from which the chapters are composed
 * @param delay - An initial delay [ms] before the {@link script} is executed
 */
export function ChaptersSinglePageJS(script: string, delay = 0) {
    return function DecorateClass<T extends Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersSinglePageJS.call(this, manga, script, delay);
            }
        };
    };
}

/**
 * A class decorator that adds the ability to create a chapter from a manga (Same identifier, same title).
 * This is useful when website doesnt have the notion of chapter or images are directly on chapter page (most likely for X-rated websites)
 */
export function ChaptersUniqueFromManga() {
    return function DecorateClass<T extends Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return [ new Chapter(this, manga, manga.Identifier, manga.Title) ];
            }
        };
    };
}

/**********************************************
 ******** Page List Extraction Methods ********
 **********************************************/

/**
 * An extension method for extracting all pages for the given {@link chapter} using the given CSS {@link query}.
 * The pages are extracted from the composed url based on the `Identifier` of the {@link chapter} and the `URI` of the website.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param chapter - A reference to the {@link Chapter} which shall be assigned as parent for the extracted pages
 * @param query - A CSS query to locate the elements from which the page information shall be extracted
 * @param extract - A function to extract the page information from a single element (found with {@link query})
 */
export async function FetchPagesSinglePageCSS<E extends HTMLElement>(this: MangaScraper, chapter: Chapter, query: string, extract = DefaultPageLinkExtractor as PageLinkExtractor<E>): Promise<Page[]> {
    const uri = new URL(chapter.Identifier, this.URI);
    const request = new Request(uri.href, {
        headers: {
            Referer: GetParentReferer(chapter, this.URI).href
        }
    });
    const data = await FetchCSS<E>(request, query);
    return data.map(element => {
        const link = new URL(extract.call(this, element), request.url);
        return new Page(this, chapter, link, { Referer: uri.href });
    });
}

/**
 * A class decorator that adds the ability to extract all pages for a given chapter using the given CSS {@link query}.
 * The pages are extracted from the composed url based on the `Identifier` of the chapter and the `URI` of the website.
 * @param query - A CSS query to locate the elements from which the page information shall be extracted
 * @param extract - A function to extract the page information from a single element (found with {@link query})
 */
export function PagesSinglePageCSS<E extends HTMLElement>(query: string, extract = DefaultPageLinkExtractor as PageLinkExtractor<E>) {
    return function DecorateClass<T extends Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesSinglePageCSS.call(this, chapter, query, extract as PageLinkExtractor<HTMLElement>);
            }
        };
    };
}

/**
 * An extension method for extracting all pages for the given {@link chapter} using the given JS {@link script}.
 * The pages are extracted from the composed url based on the `Identifier` of the {@link chapter} and the `URI` of the website.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param chapter - A reference to the {@link Chapter} which shall be assigned as parent for the extracted pages
 * @param script - A JS script to extract the image links
 * @param delay - An initial delay [ms] before the {@link script} is executed
 */
export async function FetchPagesSinglePageJS(this: MangaScraper, chapter: Chapter, script: string, delay = 0): Promise<Page[]> {
    const uri = new URL(chapter.Identifier, this.URI);
    const request = new Request(uri.href, {
        headers: {
            Referer: GetParentReferer(chapter, this.URI).href
        }
    });
    const data = await FetchWindowScript<string[]>(request, script, delay);
    return data.map(link => new Page(this, chapter, new URL(link, uri), { Referer: uri.href }));
}

/**
 * A class decorator that adds the ability to extract all pages for a given chapter using the given JS {@link script}.
 * The pages are extracted from the composed url based on the `Identifier` of the chapter and the `URI` of the website.
 * @param script - A JS script to extract the image links
 * @param delay - An initial delay [ms] before the {@link script} is executed
 */
export function PagesSinglePageJS(script: string, delay = 0) {
    return function DecorateClass<T extends Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesSinglePageJS.call(this, chapter, script, delay);
            }
        };
    };
}

/***********************************************
 ******** Image Data Extraction Methods ********
 ***********************************************/

/**
 * An extension method to get the image data for the given {@link page} according to an XHR based-approach.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param page - A reference to the {@link Page} containing the necessary information to acquire the image data
 * @param priority - The importance level for ordering the request for the image data within the internal task pool
 * @param signal - An abort signal that can be used to cancel the request for the image data
 * @param detectMimeType - Force a fingerprint check of the image data to detect its mime-type (instead of relying on the Content-Type header)
 * @param deProxifyLink - Remove common image proxies (default false)
 */
export async function FetchImageAjax(this: MangaScraper, page: Page, priority: Priority, signal: AbortSignal, detectMimeType = false, deProxifyLink = false): Promise<Blob> {
    return this.imageTaskPool.Add(async () => {
        const imageLink = deProxifyLink ? DeProxify(page.Link) : page.Link;
        const request = new Request(imageLink.href, {
            signal: signal,
            headers: {
                Referer: page.Parameters?.Referer ?? imageLink.origin,
            }
        });
        const response = await Fetch(request);
        return detectMimeType ? GetTypedData(await response.arrayBuffer()) : response.blob();
    }, priority, signal);
}

/**
 * A class decorator that adds the ability to get the image data for a given page by loading the source asynchronous with the `Fetch API`.
 * @param detectMimeType - Force a fingerprint check of the image data to detect its mime-type (instead of relying on the Content-Type header)
 * @param deProxifyLink - Remove common image proxies (default false)
 */
export function ImageAjax(detectMimeType = false, deProxifyLink = false) {
    return function DecorateClass<T extends Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchImage(this: MangaScraper, page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
                return FetchImageAjax.call(this, page, priority, signal, detectMimeType, deProxifyLink);
            }
        };
    };
}

/**
 * An extension method to get the image data for the given {@link page} simulating a request via `<img>` tag in a browser.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param page - A reference to the {@link Page} containing the necessary information to acquire the image data
 * @param priority - The importance level for ordering the request for the image data within the internal task pool
 * @param signal - An abort signal that can be used to cancel the request for the image data
 * @param includeRefererHeader - Corresponds to the `referrerpolicy` attribute of the `<img>` tag, to determine if the Referer header shall be included
 * @param detectMimeType - Force a fingerprint check of the image data to detect its mime-type (instead of relying on the Content-Type header)
 * @param deProxifyLink - Remove common image proxies (default false)
 */
export async function FetchImageElement(this: MangaScraper, page: Page, priority: Priority, signal: AbortSignal, includeRefererHeader = true, detectMimeType = false, deProxifyLink = false): Promise<Blob> {
    return this.imageTaskPool.Add(async () => {
        const imageLink = deProxifyLink ? DeProxify(page.Link) : page.Link;
        const request = new Request(imageLink.href, {
            signal: signal,
            headers: {
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                //'Sec-Fetch-Mode': 'no-cors',
                'Sec-Fetch-Dest': 'image',
            }
        });
        if (includeRefererHeader) {
            request.headers.set('Referer', page.Parameters?.Referer ?? imageLink.origin);
        }
        const response = await Fetch(request);
        return detectMimeType ? GetTypedData(await response.arrayBuffer()) : response.blob();
    }, priority, signal);
}

/**
 * A class decorator that adds the ability to get the image data for a given page by pretending to load the source via an `<IMG>` tag.
 * @param includeRefererHeader - Corresponds to the `referrerpolicy` attribute of the `<img>` tag, to determine if the Referer header shall be included
 * @param detectMimeType - Force a fingerprint check of the image data to detect its mime-type (instead of relying on the Content-Type header)
 * @param deProxifyLink - Remove common image proxies (default false)
 */
export function ImageElement(includeRefererHeader = true, detectMimeType = false, deProxifyLink = false) {
    return function DecorateClass<T extends Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchImage(this: MangaScraper, page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
                return FetchImageElement.call(this, page, priority, signal, includeRefererHeader, detectMimeType, deProxifyLink);
            }
        };
    };
}

/**
 * An extension method that adds the ability to get the image data when Page is the link to an HTML Page.
 *  Use this when Chapter are composed of multiple html Page and each page hold an image
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param page - A reference to the {@link Page} containing the necessary information to acquire the image data
 * @param priority - The importance level for ordering the request for the image data within the internal task pool
 * @param signal - An abort signal that can be used to cancel the request for the image data
 * @param queryImage - a query to get the image in the html page Page
 * @param detectMimeType - Force a fingerprint check of the image data to detect its mime-type (instead of relying on the Content-Type header)
 * @param deProxifyLink - Remove common image proxies (default false)
 */
export async function FetchImageAjaxFromHTML(this: MangaScraper, page: Page, priority: Priority, signal: AbortSignal, queryImage: string, detectMimeType = false, deProxifyLink = false): Promise<Blob> {
    const image = await this.imageTaskPool.Add(async () => {
        const request = new Request(page.Link.href, {
            signal: signal,
            headers: {
                Referer: page.Link.origin,
            }
        });
        const realimage = (await FetchCSS<HTMLImageElement>(request, queryImage))[0].getAttribute('src');
        const parameters = page.Parameters?.Referer ? { Referer: page.Parameters?.Referer } : { Referer: page.Link.origin };
        return new Page(this, page.Parent as Chapter, new URL(realimage, request.url), parameters);
    }, priority, signal);

    return await FetchImageAjax.call(this, image, priority, signal, detectMimeType, deProxifyLink);
}

/**
 * A class decorator that adds the ability to get the image data when Page is the link to an HTML Page.
 * Use this when Chapter are composed of multiple html Page and each page hold an image
 * @param queryImage - a query to get the image in the html page Page
 * @param detectMimeType - Force a fingerprint check of the image data to detect its mime-type (instead of relying on the Content-Type header)
 * @param deProxifyLink - Remove common image proxies (default false)
 */
export function ImageAjaxFromHTML(queryImage: string, detectMimeType = false, deProxifyLink = false) {
    return function DecorateClass<T extends Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchImage(this: MangaScraper, page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
                return FetchImageAjaxFromHTML.call(this, page, priority, signal, queryImage, detectMimeType, deProxifyLink);
            }
        };
    };
}

/**
 * A helper function to detect and get the mime typed image data of a buffer.
 */
export async function GetTypedData(buffer: ArrayBuffer): Promise<Blob> {
    const bytes = new Uint8Array(buffer);
    // WEBP [52 49 46 46 . . . . 57 45 42 50]
    if (bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) {
        return new Blob([bytes], { type: 'image/webp' });
    }
    // JPEG [FF D8 FF]
    if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
        return new Blob([bytes], { type: 'image/jpeg' });
    }
    // PNG [. 50 4E 47]
    if (bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
        return new Blob([bytes], { type: 'image/png' });
    }
    // GIF [47 49 46]
    if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
        return new Blob([bytes], { type: 'image/gif' });
    }
    // BMP [42 4D]
    if (bytes[0] === 0x42 && bytes[1] === 0x4D) {
        return new Blob([bytes], { type: 'image/bmp' });
    }
    // AVIF [00 00 00 20 66 74 79 70 61 76 69 66 ] ' ftypavif'
    if (bytes[8] === 0x61 && bytes[9] === 0x76 && bytes[10] === 0x69 && bytes[11] === 0x66) {
        return new Blob([bytes], { type: 'image/avif' });
    }
    return new Blob([bytes], { type: 'application/octet-stream' });
}