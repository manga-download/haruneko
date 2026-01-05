import { WebsiteResourceKey as R } from '../../../i18n/ILocale';
import { Exception, InternalError } from '../../Error';
import { Fetch, FetchCSS, FetchWindowScript } from '../../platform/FetchProvider';
import { type MangaScraper, type DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../../providers/MangaPlugin';
import type { MediaChild, MediaContainer } from '../../providers/MediaPlugin';
import type { Priority } from '../../taskpool/TaskPool';
import DeProxify from '../../transformers/ImageLinkDeProxifier';
import { Delay } from '../../BackgroundTimers';

export function ThrowOnUnsupportedDecoratorContext(context: ClassDecoratorContext) {
    if (context && context.kind !== 'class') {
        throw new InternalError(`Inalid decorator context: ${context.name}`);
    }
}

export type Constructor = new (...args: any[]) => DecoratableMangaScraper;
type ClassDecorator = <T extends Constructor>(ctor: T, context?: ClassDecoratorContext) => T;

/********************************
 ******** Link Providers ********
 ********************************/

type LinkResolver<T extends MediaContainer<MediaChild> = MediaContainer<MediaChild>> = (this: MangaScraper, media?: T) => URL;

/**
 * Creates a link from the manga scraper's base URL and the identifier of the given {@link media} container.
 */
function DefaultMediaLinkResolver(this: MangaScraper, media: MediaContainer<MediaChild>): URL {
    return new URL(media.Identifier, this.URI);
};

type LinkGeneratorFlags = {
    /**
     * Instruct the consumer of the corresponding generator to process all links in the sequence.
     * The consumer should not abort consumption until the generator stopped.
     */
    isExhaustive?: boolean;
};
type LinkGenerator<T extends MediaContainer<MediaChild> = MediaContainer<MediaChild>> = ((this: MangaScraper, media?: T) => Generator<URL>) & LinkGeneratorFlags

/**
 * Creates a finite link generator that will compose URLs based on a provided sequence of {@link endpoints}.
 * @param endpoints - A list of relative paths for the website's base URL or absolute URLs
 */
export function StaticLinkGenerator(...endpoints: string[]): LinkGenerator {
    return Object.assign<LinkGenerator, LinkGeneratorFlags>(function* (this: MangaScraper): Generator<URL> {
        yield* endpoints.map(endpoint => new URL(endpoint, this.URI));
    }, { isExhaustive: true });
}

/**
 * Creates an infinite link generator that will compose URLs based on a sequence of numbers.
 * @param endpoint - A relative path for the website's base URL or an absolute URL containing the optional placeholders `{id}` which is replaced by the media containers identifier and `{page}` which is replaced by an incrementing number
 * @param start - The start for the sequence of incremental numbers which are applied to the {@link endpoint} pattern
 * @param increment - The amount by which the sequence shall be incremented for each iteration
 */
export function PatternLinkGenerator<T extends MediaContainer<MediaChild>>(endpoint: string, start = 1, increment = 1): LinkGenerator<T> {
    return function* (this: MangaScraper, media: T): Generator<URL> {
        for (let page = start; true; page += increment) {
            yield new URL(endpoint.replace('{id}', media.Identifier).replace('{page}', `${page}`), this.URI);
        }
    };
}

/*********************************
 ******** Info Extractors ********
 *********************************/

/**
 * ...
 * @param this - ...
 * @param element - ...
 * @param uri - ...
 */
type InfoExtractor<E extends HTMLElement> = (this: MangaScraper, element: E, uri: URL) => { id: string, title: string; };

type WebsiteInfoExtractorOptions = {
    /**
     * Set this flag to include the `origin` from a given `URL` to the id (Defaults to `false`)
     */
    includeOrigin?: boolean;
    /**
     * Set this flag to include the `search` from a given `URL` to the id (Defaults to `false`)
     */
    includeSearch?: boolean;
    /**
     * Set this flag to include the `hash` from a given `URL` to the id (Defaults to `false`)
     */
    includeHash?: boolean;
    /**
     * Provide a CSS selector matching all child elements that should be removed from a given HTMLElement before extracting the id/title (Defaults to `undefined`)
     */
    queryBloat?: string;
};

/**
 * Creates an info extractor that will parse the media id from a given URL and media title from a given {@link HTMLElement}.
 * In case of an {@link HTMLMetaElement} the media title will be extracted from the `content` attribute, otherwise the `textContent` of the element will be used as media title.
 */
export function WebsiteInfoExtractor<T extends HTMLElement>({
    includeOrigin = false,
    includeSearch = false,
    includeHash = false,
    queryBloat = undefined
}: WebsiteInfoExtractorOptions = {}): InfoExtractor<HTMLElement> {
    return function (this: MangaScraper, element: T, uri: URL) {
        if (queryBloat) {
            for (const bloat of element.querySelectorAll(queryBloat)) {
                if (bloat.parentElement) {
                    bloat.parentElement.removeChild(bloat);
                }
            }
        }
        return {
            id: [
                includeOrigin ? uri.origin : undefined,
                uri.pathname,
                includeSearch ? uri.search : undefined,
                includeHash ? uri.hash : undefined,
            ].filter(segment => segment).join(''),
            title: element instanceof HTMLMetaElement ? element.content.trim() : element.innerText.trim(),
        };
    };
}

/**
 * The pre-defined default info extractor that will parse the media id from an {@link URL} and media title from an {@link HTMLElement}.
 * The media id will be extracted from the `pathname` of the URL and the media title will be extracted from the `content` attribute or `innerText` porperty of the element.
 */
export const DefaultLinkInfoExtractor: InfoExtractor<HTMLElement> = WebsiteInfoExtractor();

/**
 * Creates an info extractor that will parse the media id and media title from a given {@link HTMLAnchorElement}.
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
            title: useTitleAttribute ? element.title.trim() : element.innerText.trim()
        };
    };
}

/**
 * The pre-defined default info extractor that will parse the media id and media title from a given {@link HTMLAnchorElement}.
 * The media id will be extracted from the `pathname` and the media title will be extracted from the `text` porperty of the element.
 */
export const DefaultElementInfoExtractor: InfoExtractor<HTMLElement> = AnchorInfoExtractor();

/**************************************
 ******** Page Link Extractors ********
 **************************************/

type PageLinkExtractor<E extends HTMLElement> = (this: MangaScraper, element: E) => string;

const DefaultPageLinkExtractor = <E extends HTMLImageElement>(element: E) => element.dataset.src || element.getAttribute('src') || ''; // TODO: Throw if none found?

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
 */
export async function FetchMangaCSS<E extends HTMLElement = HTMLElement>(this: MangaScraper, provider: MangaPlugin, url: string, query: string, extract: InfoExtractor<E> = DefaultLinkInfoExtractor): Promise<Manga> {
    const uri = new URL(url);
    const request = new Request(uri.href, {
        headers: {
            Referer: uri.href
        }
    });
    const [element] = await FetchCSS<E>(request, query);
    const { id, title } = extract.call(this, element, uri);
    return new Manga(this, provider, id, title);
}

/**
 * A class decorator that adds the ability to extract a manga using the given CSS {@link query} from any url that matches the given {@link pattern}.
 * The `pathname` of the url will be used as identifier for the extracted manga.
 * When the CSS {@link query} matches a `meta` element, the manga title will be extracted from its `content` attribute, otherwise the `textContent` of the element will be used as manga title.
 * @param pattern - An expression to check if a manga can be extracted from an url or not, it may contain the placeholders `{origin}` and `{hostname}` which will be replaced with the corresponding parameters based on the website's base URL
 * @param query - A CSS query to locate the element from which the manga title shall be extracted
 */
export function MangaCSS<E extends HTMLElement = HTMLElement>(pattern: RegExp, query: string, extract: InfoExtractor<E> = DefaultLinkInfoExtractor) {
    return function DecorateClass<T extends Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public ValidateMangaURL(this: MangaScraper, url: string): boolean {
                const source = pattern.source.replaceAll('{origin}', this.URI.origin).replaceAll('{hostname}', this.URI.hostname);
                return new RegExpSafe(source, pattern.flags).test(url);
            }
            public async FetchManga(this: MangaScraper, provider: MangaPlugin, url: string): Promise<Manga> {
                return FetchMangaCSS.call(this, provider, url, query, extract);
            }
        };
    };
}

/***********************************************
 ******** Manga List Extraction Methods ********
 ***********************************************/

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
 * An extension method for extracting multiple mangas from the given relative {@link endpoint} using the given CSS {@link query}.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param provider - A reference to the {@link MangaPlugin} which shall be assigned as parent for the extracted mangas
 * @param resource -
 * - A relative path for the website's base URL or an absolute URL from which the mangas shall be extracted
 * - A function to create the URL based on the provided media container (plugin) from which the mangas shall be extracted
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 * @param extract - A function to extract the manga identifier and title from a single element (found with {@link query})
 */
export async function FetchMangasSinglePageCSS<E extends HTMLElement>(this: MangaScraper, provider: MangaPlugin, resource: string | LinkResolver<MangaPlugin>, query: string, extract: InfoExtractor<E> = DefaultElementInfoExtractor) {
    const uri = typeof resource === 'string' ? new URL(resource, this.URI) : resource.call(this, provider);
    const request = new Request(uri, {
        headers: {
            Referer: this.URI.href
        }
    });
    const data = await FetchCSS<E>(request, query);
    return data.map(element => {
        const { id, title } = extract.call(this, element, uri);
        return new Manga(this, provider, id, title);
    });
}

/**
 * A class decorator that adds the ability to extract multiple mangas from the given relative {@link endpoints} using the given CSS {@link query}.
 * @param resource -
 * - A relative path for the website's base URL or an absolute URL from which the mangas shall be extracted
 * - A function to create the URL based on the provided media container (plugin) from which the mangas shall be extracted
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 * @param extract - A function to extract the manga identifier and title from a single element (found with {@link query})
 */
export function MangasSinglePageCSS<E extends HTMLElement>(resource: string | LinkResolver<MangaPlugin>, query: string, extract: InfoExtractor<E> = DefaultElementInfoExtractor) {
    return function DecorateClass<T extends Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchMangas(this: MangaScraper, provider: MangaPlugin): Promise<Manga[]> {
                return FetchMangasSinglePageCSS.call(this, provider, resource, query, extract);
            }
        };
    };
}

/**
* An extension method for extracting multiple mangas from a range of URLs generated with {@link generate} using the given CSS {@link query}.
* - When the link generator is exhaustive, all URLs will be processed.
* - When the link generator is infinite, the processing will be stopped when there are no new chapters.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param provider - A reference to the {@link MangaPlugin} which shall be assigned as parent for the extracted mangas
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 * @param generate - A link generator that will provide the URLs from which the mangas shall be extracted
 * @param throttle - A delay [ms] for each request (only required for rate-limited websites)
 * @param extract - A function to extract the manga identifier and title from a single element (found with {@link query})
 */
export async function FetchMangasMultiPageCSS<E extends HTMLElement>(this: MangaScraper, provider: MangaPlugin, query: string, generate: LinkGenerator<MangaPlugin>, throttle = 0, extract: InfoExtractor<E> = DefaultElementInfoExtractor): Promise<Manga[]> {
    const mangaList: Manga[] = [];
    let reducer = Promise.resolve();
    for (const uri of generate.call(this, provider)) {
        await reducer;
        reducer = throttle > 0 ? Delay(throttle) : Promise.resolve();
        const mangas = await FetchMangasSinglePageCSS.call(this, provider, () => uri, query, extract);
        if (generate.isExhaustive || mangaList.isMissingLastItemFrom(mangas)) {
            mangaList.push(...mangas); // TODO: Broadcast event that mangalist for provider has been updated?
        } else {
            break;
        }
    }
    return mangaList.distinct();
}

/**
 * A class decorator that adds the ability to extract multiple mangas from a range of URLs generated with {@link generate} using the given CSS {@link query}.
 * - When the link generator is exhaustive, all URLs will be processed.
 * - When the link generator is infinite, the processing will be stopped when there are no new mangas.
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 * @param generate - A link generator that will provide the URLs from which the mangas shall be extracted
 * @param throttle - A delay [ms] for each request (only required for rate-limited websites)
 * @param extract - A function to extract the manga identifier and title from a single element (found with {@link query})
 */
export function MangasMultiPageCSS<E extends HTMLElement>(query: string, generate: LinkGenerator<MangaPlugin>, throttle = 0, extract: InfoExtractor<E> = DefaultElementInfoExtractor) {
    return function DecorateClass<T extends Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchMangas(this: MangaScraper, provider: MangaPlugin): Promise<Manga[]> {
                return FetchMangasMultiPageCSS.call(this, provider, query, generate, throttle, extract as InfoExtractor<HTMLElement>);
            }
        };
    };
}

/*************************************************
 ******** Chapter List Extraction Methods ********
 *************************************************/

/**
* An extension method for extracting all chapters for the given {@link manga} using the given CSS {@link query}.
* @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
* @param manga - A reference to the {@link Manga} which shall be assigned as parent for the extracted chapters
* @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
* @param resource -
* - A relative path for the website's base URL or an absolute URL from which the chapters shall be extracted
* - A function to create the URL based on the provided media container (manga) from which the chapters shall be extracted
* @param extract - A function to extract the chapter identifier and title from a single element (found with {@link query})
 */
export async function FetchChaptersSinglePageCSS<E extends HTMLElement>(this: MangaScraper, manga: Manga, query: string, resource: string | LinkResolver<Manga> = DefaultMediaLinkResolver, extract = DefaultElementInfoExtractor as InfoExtractor<E>): Promise<Chapter[]> {
    const uri = typeof resource === 'string' ? new URL(resource, this.URI) : resource.call(this, manga);
    const request = new Request(uri, {
        headers: {
            Referer: this.URI.href
        }
    });
    const data = await FetchCSS<E>(request, query);
    return data.map(element => {
        const { id, title } = extract.call(this, element, uri);
        return new Chapter(this, manga, id, title.replace(manga.Title, '').trim() || manga.Title);
    }).distinct();
}

/**
 * A class decorator that adds the ability to extract all chapters for a given manga from this website using the given CSS {@link query}.
 * The chapters are extracted from the composed url based on the `Identifier` of the manga and the `URI` of the website.
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 * @param resource -
 * - A relative path for the website's base URL or an absolute URL from which the chapters shall be extracted
 * - A function to create the URL based on the provided media container (manga) from which the chapters shall be extracted
 * @param extract - A function to extract the chapter identifier and title from a single element (found with {@link query})
 */
export function ChaptersSinglePageCSS<E extends HTMLElement>(query: string, resource: string | LinkResolver<Manga> = DefaultMediaLinkResolver, extract = DefaultElementInfoExtractor as InfoExtractor<E>): ClassDecorator {
    return function DecorateClass<T extends Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersSinglePageCSS.call(this, manga, query, resource, extract as InfoExtractor<HTMLElement>);
            }
        };
    };
}

/**
 * An extension method for extracting multiple chapters from a range of URLs generated with {@link generate} using the given CSS {@link query}.
 * - When the link generator is exhaustive, all URLs will be processed.
 * - When the link generator is infinite, the processing will be stopped when there are no new chapters.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param manga - A reference to the {@link Manga} which shall be assigned as parent for the extracted chapters
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 * @param generate - A link generator that will provide the URLs from which the chapters shall be extracted
 * @param throttle - A delay [ms] for each request (only required for rate-limited websites)
 * @param extract - A function to extract the chapter identifier and title from a single element (found with {@link query})
 */
export async function FetchChaptersMultiPageCSS<E extends HTMLElement>(this: MangaScraper, manga: Manga, query: string, generate: LinkGenerator<Manga>, throttle = 0, extract = DefaultElementInfoExtractor as InfoExtractor<E>): Promise<Chapter[]> {
    const chapterList: Chapter[] = [];
    let reducer = Promise.resolve();
    for (const uri of generate.call(this, manga)) {
        await reducer;
        reducer = throttle > 0 ? Delay(throttle) : Promise.resolve();
        const chapters = await FetchChaptersSinglePageCSS.call(this, manga, query, () => uri, extract as InfoExtractor<HTMLElement>);
        if (generate.isExhaustive || chapterList.isMissingLastItemFrom(chapters)) {
            chapterList.push(...chapters); // TODO: Broadcast event that chapterlist for manga has been updated?
        } else {
            break;
        }
    }
    return chapterList.distinct();
}

/**
 * A class decorator that adds the ability to extract multiple chapters from a range of URLs generated with {@link generate} using the given CSS {@link query}.
 * - When the link generator is exhaustive, all URLs will be processed.
 * - When the link generator is infinite, the processing will be stopped when there are no new chapters.
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 * @param generate - A link generator that will provide the URLs from which the chapters shall be extracted
 * @param throttle - A delay [ms] for each request (only required for rate-limited websites)
 * @param extract - A function to extract the chapter identifier and title from a single element (found with {@link query})
 */
export function ChaptersMultiPageCSS<E extends HTMLElement>(query: string, generate: LinkGenerator<Manga>, throttle = 0, extract = DefaultElementInfoExtractor as InfoExtractor<E>): ClassDecorator {
    return function DecorateClass<T extends Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersMultiPageCSS.call(this, manga, query, generate, throttle, extract as InfoExtractor<E>);
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
    const data = await FetchWindowScript<{ id: string, title: string; }[]>(request, script, delay);
    // NOTE: The Array prototype of `data` comes from a different window context and therefore is missing prototype extensions made for Array in this window context
    //       => Spread `data` into a new Array
    return [...data].map(entry => {
        return new Chapter(this, manga, entry.id, entry.title.replace(manga.Title, '').trim() || manga.Title);
    }).distinct();
}

/**
 * A class decorator that adds the ability to extract all chapters for a given manga from this website using the given JS {@link script}.
 * The chapters are extracted from the composed url based on the `Identifier` of the manga and the `URI` of the website.
 * @param script - A JS script to extract a list of entries with each entry containing the identifier and title property from which the chapters are composed
 * @param delay - An initial delay [ms] before the {@link script} is executed
 */
export function ChaptersSinglePageJS(script: string, delay = 0): ClassDecorator {
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
export function ChaptersUniqueFromManga(): ClassDecorator {
    return function DecorateClass<T extends Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return [new Chapter(this, manga, manga.Identifier, manga.Title)];
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
 * @param show - Show window or not
 */
export async function FetchPagesSinglePageJS(this: MangaScraper, chapter: Chapter, script: string, delay = 0, show: boolean = false): Promise<Page[]> {
    const uri = new URL(chapter.Identifier, this.URI);
    const request = new Request(uri.href, {
        headers: {
            Referer: GetParentReferer(chapter, this.URI).href
        }
    });
    const data = await FetchWindowScript<string[]>(request, script, delay, undefined, show);
    return data.map(link => new Page(this, chapter, new URL(link, uri), { Referer: uri.href }));
}

/**
 * A class decorator that adds the ability to extract all pages for a given chapter using the given JS {@link script}.
 * The pages are extracted from the composed url based on the `Identifier` of the chapter and the `URI` of the website.
 * @param script - A JS script to extract the image links
 * @param delay - An initial delay [ms] before the {@link script} is executed
 * @param show - Show window or not
  */
export function PagesSinglePageJS(script: string, delay = 0, show: boolean = false) {
    return function DecorateClass<T extends Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesSinglePageJS.call(this, chapter, script, delay, show);
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
 * @param deProxifyLink - Remove common image proxies and try to bypass {@link https://developers.cloudflare.com/images/polish/ | CF Image Polish} (default false)
 */
export async function FetchImageAjax(this: MangaScraper, page: Page, priority: Priority, signal: AbortSignal, detectMimeType = false, deProxifyLink = false): Promise<Blob> {
    return this.imageTaskPool.Add(async () => {
        const imageLink = deProxifyLink ? DeProxify(page.Link) : page.Link;
        const headers = {
            'Referer': page.Parameters?.Referer ?? imageLink.origin,
        };
        const request = new Request(imageLink, { signal, headers });
        let response = await Fetch(request);
        if (deProxifyLink && response.headers.has('Cf-Polished')) {
            headers['Origin'] = imageLink.protocol + '//' + Date.now().toString(36) + Math.random().toString(36);
            response = await Fetch(new Request(imageLink, { signal, headers }));
        }
        return detectMimeType ? GetTypedData(await response.arrayBuffer()) : response.blob();
    }, priority, signal);
}

/**
 * A class decorator that adds the ability to get the image data for a given page by loading the source asynchronous with the `Fetch API`.
 * @param detectMimeType - Force a fingerprint check of the image data to detect its mime-type (instead of relying on the Content-Type header)
 * @param deProxifyLink - Remove common image proxies and try to bypass {@link https://developers.cloudflare.com/images/polish/ | CF Image Polish} (default false)
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
 * @param deProxifyLink - Remove common image proxies and try to bypass {@link https://developers.cloudflare.com/images/polish/ | CF Image Polish} (default false)
 */
export async function FetchImageElement(this: MangaScraper, page: Page, priority: Priority, signal: AbortSignal, includeRefererHeader = true, detectMimeType = false, deProxifyLink = false): Promise<Blob> {
    return this.imageTaskPool.Add(async () => {
        const imageLink = deProxifyLink ? DeProxify(page.Link) : page.Link;
        const headers = {
            'Referer': includeRefererHeader ? page.Parameters?.Referer ?? imageLink.origin : undefined,
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'Sec-Fetch-Mode': 'no-cors',
            'Sec-Fetch-Dest': 'image',
        };
        let response = await Fetch(new Request(imageLink, { signal, headers }));
        if (deProxifyLink && response.headers.has('Cf-Polished')) {
            headers['Origin'] = imageLink.protocol + '//' + Date.now().toString(36) + Math.random().toString(36);
            response = await Fetch(new Request(imageLink, { signal, headers }));
        }
        return detectMimeType ? GetTypedData(await response.arrayBuffer()) : response.blob();
    }, priority, signal);
}

/**
 * A class decorator that adds the ability to get the image data for a given page by pretending to load the source via an `<IMG>` tag.
 * @param includeRefererHeader - Corresponds to the `referrerpolicy` attribute of the `<img>` tag, to determine if the Referer header shall be included
 * @param detectMimeType - Force a fingerprint check of the image data to detect its mime-type (instead of relying on the Content-Type header)
 * @param deProxifyLink - Remove common image proxies and try to bypass {@link https://developers.cloudflare.com/images/polish/ | CF Image Polish} (default false)
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
 * @param deProxifyLink - Remove common image proxies and try to bypass {@link https://developers.cloudflare.com/images/polish/ | CF Image Polish} (default false)
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
 * @param deProxifyLink - Remove common image proxies and try to bypass {@link https://developers.cloudflare.com/images/polish/ | CF Image Polish} (default false)
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

/********************************
 ******** Helper Methods ********
 ********************************/

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