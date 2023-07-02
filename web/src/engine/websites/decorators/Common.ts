import { GetLocale } from '../../../i18n/Localization';
import { FetchRequest, Fetch, FetchCSS, FetchWindowScript } from '../../FetchProvider';
import { type MangaScraper, type DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../../providers/MangaPlugin';
import type { IMediaContainer } from '../../providers/MediaPlugin';
import type { Priority } from '../../taskpool/TaskPool';

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

function GetParentReferer(item: IMediaContainer, base: URL): URL {
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
    const request = new FetchRequest(uri.href, {
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
 * @param pattern - An expression to check if a manga can be extracted from an url or not
 * @param query - A CSS query to locate the element from which the manga title shall be extracted
 * @param includeSearch - append Uri.search to the manga identifier
 * @param includeHash - append Uri.hash to the manga identifier
 */
export function MangaCSS(pattern: RegExp, query: string, extract = DefaultLabelExtractor as LabelExtractor, includeSearch = false, includeHash = false) {
    return function DecorateClass<T extends Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        if (context && context.kind !== 'class') {
            throw new Error(context.name);
        }
        return class extends ctor {
            public ValidateMangaURL(this: MangaScraper, url: string): boolean {
                return pattern.test(url);
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

function EndsWith(target: Manga[], source: Manga[]) {
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
    throw new Error(GetLocale().Plugin_Common_MangasNotSupported());
}

/**
 * A class decorator that throws an error ... .
 */
export function MangasNotSupported() {
    return function DecorateClass<T extends Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        if (context && context.kind !== 'class') {
            throw new Error(context.name);
        }
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
    const request = new FetchRequest(uri.href, {
        headers: {
            Referer: this.URI.href
        }
    });
    const data = await FetchCSS<E>(request, query);
    return data.map(element => {
        const { id, title } = extract.call(this, element);
        return new Manga(this, provider, id, title);
    });
}

/**
 * A class decorator that adds the ability to extract multiple mangas from the given relative {@link path} using the given CSS {@link query}.
 * @param path - The path relative to the scraper's base url from which the mangas shall be extracted
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 * @param extract - A function to extract the manga identifier and title from a single element (found with {@link query})
 */
export function MangasSinglePageCSS<E extends HTMLElement>(path: string, query: string, extract = DefaultInfoExtractor as InfoExtractor<E>) {
    return function DecorateClass<T extends Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        if (context && context.kind !== 'class') {
            throw new Error(context.name);
        }
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
    const mangaList = [];
    let reducer = Promise.resolve();
    for (let page = start, run = true; run; page += step) {
        await reducer;
        reducer = throttle > 0 ? new Promise(resolve => setTimeout(resolve, throttle)) : Promise.resolve();
        const mangas = await FetchMangasSinglePageCSS.call(this, provider, path.replace('{page}', `${page}`), query, extract as InfoExtractor<HTMLElement>);
        // Always add when mangaList is empty ... (length = 0)
        mangas.length > 0 && !EndsWith(mangaList, mangas) ? mangaList.push(...mangas) : run = false;
        // TODO: Broadcast event that mangalist for provider has been updated?
    }
    return mangaList;
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
        if (context && context.kind !== 'class') {
            throw new Error(context.name);
        }
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
    const request = new FetchRequest(uri.href, {
        headers: {
            Referer: this.URI.href
        }
    });
    const data = await FetchCSS<E>(request, query);
    return data.map(element => {
        const { id, title } = extract.call(this, element);
        return new Chapter(this, manga, id, title.replace(manga.Title, '').trim() || manga.Title);
    });
}

/**
 * A class decorator that adds the ability to extract all chapters for a given manga from this website using the given CSS {@link query}.
 * The chapters are extracted from the composed url based on the `Identifier` of the manga and the `URI` of the website.
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 * @param extract - A function to extract the chapter identifier and title from a single element (found with {@link query})
 */
export function ChaptersSinglePageCSS<E extends HTMLElement>(query: string, extract = DefaultInfoExtractor as InfoExtractor<E>) {
    return function DecorateClass<T extends Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        if (context && context.kind !== 'class') {
            throw new Error(context.name);
        }
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
    const request = new FetchRequest(uri.href, {
        headers: {
            Referer: this.URI.href
        }
    });
    const data = await FetchWindowScript<{ id: string, title: string }[]>(request, script, delay);
    return data.map(entry => {
        return new Chapter(this, manga, entry.id, entry.title.replace(manga.Title, '').trim() || manga.Title);
    });
}

/**
 * A class decorator that adds the ability to extract all chapters for a given manga from this website using the given JS {@link script}.
 * The chapters are extracted from the composed url based on the `Identifier` of the manga and the `URI` of the website.
 * @param script - A JS script to extract a list of entries with each entry containing the identifier and title property from which the chapters are composed
 * @param delay - An initial delay [ms] before the {@link script} is executed
 */
export function ChaptersSinglePageJS(script: string, delay = 0) {
    return function DecorateClass<T extends Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        if (context && context.kind !== 'class') {
            throw new Error(context.name);
        }
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
        if (context && context.kind !== 'class') {
            throw new Error(context.name);
        }
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return [new Chapter(this, manga, manga.Identifier, manga.Title)];
            }
        };
    };
}

/**********************************************
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
    const request = new FetchRequest(uri.href, {
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
        if (context && context.kind !== 'class') {
            throw new Error(context.name);
        }
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
    const request = new FetchRequest(uri.href, {
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
        if (context && context.kind !== 'class') {
            throw new Error(context.name);
        }
        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesSinglePageJS.call(this, chapter, script, delay);
            }
        };
    };
}

/**
 * An extension method for extracting all pages for the given {@link chapter} using the given CSS {@link query}.
 * Use this when the chapter is made from multiples pages and each "sub pages" get a single or more images
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param chapter - A reference to the {@link Chapter} which shall be assigned as parent for the extracted pages
 * @param querySubPages - A CSS query to locate the HtmlSelectElement from which the subpages location shall be extracted. Only the first will be used.
 * @param queryPages - A CSS query to locate the images in each subpage
 * @param extractSubPages - A function to extract the subpage information from a single element (found with {@link query})
 * @param extractPages - A function to extract the page information from a single element (found with {@link query})
  * */
export async function FetchPagesSubPagesCSS<E extends HTMLElement>(this: MangaScraper, chapter: Chapter, querySubPages: string, queryPages: string, extractSubPages: PageLinkExtractor<HTMLElement>, extractPages = DefaultPageLinkExtractor as PageLinkExtractor<E>): Promise<Page[]> {
    const uri = new URL(chapter.Identifier, this.URI);
    let request = new FetchRequest(uri.href, {
        headers: {
            Referer: GetParentReferer(chapter, this.URI).href
        }
    });
    let data = await FetchCSS<HTMLElement>(request, querySubPages); //Here we got the sub pages list NODES
    //Since the CSS selector is supposed to match a <select> element with the list of subpages but reader may have more than one, we take only the first
    const subpages = [...data[0].querySelectorAll('option')].map(element => extractSubPages.call(this, element));

    const pagelist: Page[] = [];
    for (const subpage of subpages) {
        request = new FetchRequest(subpage, {
            headers: {
                Referer: GetParentReferer(chapter, this.URI).href
            }
        });
        data = await FetchCSS<E>(request, queryPages);
        data.map(element => {
            const picUrl = extractPages.call(this, element);
            pagelist.push(new Page(this, chapter, new URL(picUrl, this.URI), { Referer: subpage }));
        });
    }
    return pagelist;
}

/**
 * A class decorator that adds the ability to extract all pages for a given chapter using the given CSS {@link query}.
 * Use this when the chapter is made from multiples pages and each "sub pages" get a single or more images
 * @param querySubPages - A CSS query to locate the HtmlSelectElement from which the subpages location shall be extracted. Only the first will be used.
 * @param queryPages - A CSS query to locate the images in each subpage
 * @param extractSubPages - A function to extract the subpage information from a single element (found with {@link query})
 * @param extractPages - A function to extract the page information from a single element (found with {@link query})
 */
export function PagesSubPagesCSS<E extends HTMLElement>(querySubPages: string, queryPages: string, extractSubPages :PageLinkExtractor<E>, extractPages = DefaultPageLinkExtractor as PageLinkExtractor<E>) {
    return function DecorateClass<T extends Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        if (context && context.kind !== 'class') {
            throw new Error(context.name);
        }
        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesSubPagesCSS.call(this, chapter, querySubPages, queryPages, extractSubPages as PageLinkExtractor<HTMLElement>, extractPages as PageLinkExtractor<HTMLElement>);
            }
        };
    };
}

/***********************************************
 ******** Image Data Extraction Methods ********
 ***********************************************/

/**
 * An extension method to get the image data for the given {@link page}.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param page - A reference to the {@link Page} containing the necessary information to acquire the image data
 * @param priority - The importance level for ordering the request for the image data within the internal task pool
 * @param signal - An abort signal that can be used to cancel the request for the image data
 * @param detectMimeType - Force a fingerprint check of the image data to detect its mime-type (instead of relying on the Content-Type header)
 */
export async function FetchImage(this: MangaScraper, page: Page, priority: Priority, signal: AbortSignal, detectMimeType = false, pretendImageElementSource = false): Promise<Blob> {
    return this.imageTaskPool.Add(async () => {
        const request = new FetchRequest(page.Link.href, {
            signal: signal,
            headers: {
                Referer: page.Parameters?.Referer || page.Link.origin,
            }
        });
        if(pretendImageElementSource) {
            request.headers.set('Accept', 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8');
            request.headers.set('Sec-Fetch-Dest', 'image');
            //request.headers.set('Sec-Fetch-Mode', 'no-cors');
        }
        const response = await Fetch(request);
        return detectMimeType ? GetTypedData(await response.arrayBuffer()) : response.blob();
    }, priority, signal);
}

/**
 * A class decorator that adds the ability to get the image data for a given page by loading the source asynchronous with the `Fetch API`.
 * @param detectMimeType - Force a fingerprint check of the image data to detect its mime-type (instead of relying on the Content-Type header)
 */
export function ImageAjax(detectMimeType = false) {
    return function DecorateClass<T extends Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        if (context && context.kind !== 'class') {
            throw new Error(context.name);
        }
        return class extends ctor {
            public async FetchImage(this: MangaScraper, page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
                return FetchImage.call(this, page, priority, signal, detectMimeType, false);
            }
        };
    };
}

/**
 * A class decorator that adds the ability to get the image data for a given page by pretending to load the source via an `<IMG>` tag.
 * @param detectMimeType - Force a fingerprint check of the image data to detect its mime-type (instead of relying on the Content-Type header)
 */
export function ImageElement(detectMimeType = false) {
    return function DecorateClass<T extends Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        if (context && context.kind !== 'class') {
            throw new Error(context.name);
        }
        return class extends ctor {
            public async FetchImage(this: MangaScraper, page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
                return FetchImage.call(this, page, priority, signal, detectMimeType, true);
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