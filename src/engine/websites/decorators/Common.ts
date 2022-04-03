import { Fetch, FetchCSS, FetchRequest } from '../../FetchProvider';
import { MangaScraper, DecoratableMangaScraper, MangaPlugin, Manga, Chapter, Page } from '../../providers/MangaPlugin';
import type { Priority } from '../../taskpool/TaskPool';

type Constructor = new (...args: any[]) => DecoratableMangaScraper;

type InfoExtractor<E extends HTMLElement> = (element: E) => { id: string, title: string };

/**
 * The pre-defined default info extractor that will parse the media id and media title from a given {@link HTMLAnchorElement}.
 * The media title will be extracted from the `text` porperty of the element.
 */
function DefaultInfoExtractor<E extends HTMLAnchorElement>(element: E): { id: string, title: string } {
    const extract = AnchorInfoExtractor();
    return extract(element);
}

type ImageExtractor<E extends HTMLElement> = (element: E) => string;

function DefaultImageExtractor<E extends HTMLImageElement>(element: E): string {
    return element.dataset.src || element.getAttribute('src') || ''; // TODO: Throw if none found?
}

/**
 * Creates an info extractor that will parse the media id and media title from an {@link HTMLAnchorElement}.
 * @param useTitleAttribute If set to `true`, the media title will be extracted from the `title` attribute of the element, otherwise the `text` porperty of the element will be used as media title.
 */
export function AnchorInfoExtractor(useTitleAttribute = false): InfoExtractor<HTMLAnchorElement> {
    return function(element: HTMLAnchorElement) {
        return {
            id: element.pathname,
            title: useTitleAttribute ? element.title.trim() : element.text.trim()
        };
    };
}

export function InnerAnchorInfoExtractor(query: string): InfoExtractor<HTMLAnchorElement> {
    return function(element: HTMLAnchorElement) {
        const nested = element.querySelector(query);
        if(!nested) {
            throw new Error('TODO: localize error for "Failed to extract manga title!"');
        }
        return {
            id: element.pathname,
            title: nested.innerHTML.trim()
        };
    };
}

/***************************************************
 ******** Manga from URL Extraction Methods ********
 ***************************************************/

/**
 * An extension method for a {@link MangaScraper} instance, that can be used to extract a manga from a given url.
 * It will use the `pathname` of the url as manga id and the `content` attribute or `textContent` of the element found by the given CSS query as manga title.
 */
export async function FetchMangaCSS<E extends HTMLElement>(this: MangaScraper, provider: MangaPlugin, url: string, query: string): Promise<Manga> {
    const uri = new URL(url);
    const request = new FetchRequest(uri.href);
    const data = (await FetchCSS<E>(request, query)).pop();
    const title = data instanceof HTMLMetaElement ? data.content : data.textContent.trim();
    return new Manga(this, provider, uri.pathname, title);
}

/**
 * A class decorator for any {@link DecoratableMangaScraper} implementation, that will overwrite the {@link MangaScraper.FetchManga} method with {@link FetchMangaCSS}.
 */
export function MangaCSS(query: string) {
    return function DecorateClass<T extends Constructor>(ctor: T): T {
        return class extends ctor {
            public async FetchManga(this: MangaScraper, provider: MangaPlugin, url: string): Promise<Manga> {
                return FetchMangaCSS.call(this, provider, url, query);
            }
        };
    };
}

/***********************************************
 ******** Manga List Extraction Methods ********
 ***********************************************/

/**
 * An extension method for a {@link MangaScraper} instance, that can be used to extract a manga list by parsing a single URI of a webiste with the given CSS query.
 */
export async function FetchMangasSinglePageCSS<E extends HTMLElement>(this: MangaScraper, provider: MangaPlugin, path: string, query: string, extract = DefaultInfoExtractor as InfoExtractor<E>): Promise<Manga[]> {
    const uri = new URL(path, this.URI);
    const request = new FetchRequest(uri.href);
    const data = await FetchCSS<E>(request, query);
    return data.map(element => {
        const { id, title } = extract(element);
        return new Manga(this, provider, id, title);
    });
}

/**
 * A class decorator for any {@link DecoratableMangaScraper} implementation, that will overwrite the {@link MangaScraper.FetchMangas} method with {@link FetchMangasSinglePageCSS}.
 */
export function MangasSinglePageCSS<E extends HTMLElement>(path: string, query: string, extract = DefaultInfoExtractor as InfoExtractor<E>) {
    return function DecorateClass<T extends Constructor>(ctor: T): T {
        return class extends ctor {
            public async FetchMangas(this: MangaScraper, provider: MangaPlugin): Promise<Manga[]> {
                return FetchMangasSinglePageCSS.call(this, provider, path, query, extract as InfoExtractor<HTMLElement>);
            }
        };
    };
}

/**
 * An extension method for a {@link MangaScraper} instance, that can be used to extract a manga list by parsing multiple URIs of a webiste with the given CSS query.
 */
export async function FetchMangasMultiPageCSS<E extends HTMLElement>(this: MangaScraper, provider: MangaPlugin, path: string, query: string, start = 1, extract = DefaultInfoExtractor as InfoExtractor<E>): Promise<Manga[]> {
    const mangaList = [];
    for(let page = start, run = true; run; page++) {
        const mangas = await FetchMangasSinglePageCSS.call(this, provider, path.replace('{page}', `${page}`), query, extract as InfoExtractor<HTMLElement>);
        mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        // TODO: Broadcast event that mangalist for provider has been updated?
    }
    return mangaList;
}

/**
 * A class decorator for any {@link DecoratableMangaScraper} implementation, that will overwrite the {@link MangaScraper.FetchMangas} method with {@link FetchMangasMultiPageCSS}.
 */
export function MangasMultiPageCSS<E extends HTMLElement>(path: string, query: string, start = 1, extract = DefaultInfoExtractor as InfoExtractor<E>) {
    return function DecorateClass<T extends Constructor>(ctor: T): T {
        return class extends ctor {
            public async FetchMangas(this: MangaScraper, provider: MangaPlugin): Promise<Manga[]> {
                return FetchMangasMultiPageCSS.call(this, provider, path, query, start, extract as InfoExtractor<HTMLElement>);
            }
        };
    };
}

/*************************************************
 ******** Chapter List Extraction Methods ********
 *************************************************/

/**
 * An extension method for a {@link MangaScraper} instance, that can be used to extract a chapter list by parsing a single URI of a webiste with the given CSS query.
 */
export async function FetchChaptersSinglePageCSS<E extends HTMLElement>(this: MangaScraper, manga: Manga, query: string, extract = DefaultInfoExtractor as InfoExtractor<E>): Promise<Chapter[]> {
    const uri = new URL(manga.Identifier, this.URI);
    const request = new FetchRequest(uri.href);
    const data = await FetchCSS<E>(request, query);
    return data.map(element => {
        const { id, title } = extract(element);
        return new Chapter(this, manga, id, title);
    });
}

/**
 * A class decorator for any {@link DecoratableMangaScraper} implementation, that will overwrite the {@link MangaScraper.FetchChapters} method with {@link FetchChaptersSinglePageCSS}.
 */
export function ChaptersSinglePageCSS<E extends HTMLElement>(query: string, extract = DefaultInfoExtractor as InfoExtractor<E>) {
    return function DecorateClass<T extends Constructor>(ctor: T): T {
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersSinglePageCSS.call(this, manga, query, extract as InfoExtractor<HTMLElement>);
            }
        };
    };
}

/**********************************************
 ******** Page List Extraction Methods ********
 **********************************************/

/**
 * An extension method for a {@link MangaScraper} instance, that can be used to extract a page list by parsing a single URI of a webiste with the given CSS query.
 */
export async function FetchPagesSinglePageCSS<E extends HTMLElement>(this: MangaScraper, chapter: Chapter, query: string, extract = DefaultImageExtractor as ImageExtractor<E>): Promise<Page[]> {
    const uri = new URL(chapter.Identifier, this.URI);
    const request = new FetchRequest(uri.href);
    const data = await FetchCSS<E>(request, query);
    return data.map(element => {
        const link = new URL(extract(element), request.url);
        return new Page(this, chapter, link, { Referer: uri.href });
    });
}

/**
 * A class decorator for any {@link DecoratableMangaScraper} implementation, that will overwrite the {@link MangaScraper.FetchPages} method with {@link FetchPagesSinglePageCSS}.
 */
export function PagesSinglePageCSS<E extends HTMLElement>(query: string, extract = DefaultImageExtractor as ImageExtractor<E>) {
    return function DecorateClass<T extends Constructor>(ctor: T): T {
        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesSinglePageCSS.call(this, chapter, query, extract as ImageExtractor<HTMLElement>);
            }
        };
    };
}

/***********************************************
 ******** Image Data Extraction Methods ********
 ***********************************************/

/**
 * An extension method for a {@link MangaScraper} instance, that can be used to get the image data by requesting the raw binary data and optionally detect the mime type.
 */
export async function FetchImageDirect(this: MangaScraper, page: Page, priority: Priority, detectMimeType = false): Promise<Blob> {
    return this.imageTaskPool.Add(async () => {
        const request = new FetchRequest(page.Link.href, {
            headers: {
                Referer: page.Parameters && page.Parameters['Referer'] ? page.Parameters['Referer'] : page.Link.origin
            }
        });
        const response = await Fetch(request);
        return detectMimeType ? GetTypedData(await response.arrayBuffer()) : response.blob();
    }, priority);
}

/**
 * A class decorator for any {@link DecoratableMangaScraper} implementation, that will overwrite the {@link MangaScraper.FetchImage} method with {@link FetchImageDirect}.
 */
export function ImageDirect(detectMimeType = false) {
    return function DecorateClass<T extends Constructor>(ctor: T): T {
        return class extends ctor {
            public async FetchImage(this: MangaScraper, page: Page, priority: Priority): Promise<Blob> {
                return FetchImageDirect.call(this, page, priority, detectMimeType);
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
    if(bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50 ) {
        return new Blob([bytes], { type: 'image/webp' });
    }
    // JPEG [FF D8 FF]
    if(bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF ) {
        return new Blob([bytes], { type: 'image/jpeg' });
    }
    // PNG [. 50 4E 47]
    if(bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47 ) {
        return new Blob([bytes], { type: 'image/png' });
    }
    // GIF [47 49 46]
    if(bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 ) {
        return new Blob([bytes], { type: 'image/gif' });
    }
    // BMP [42 4D]
    if(bytes[0] === 0x42 && bytes[1] === 0x4D ) {
        return new Blob([bytes], { type: 'image/bmp' });
    }
    return new Blob([bytes], { type: 'application/octet-stream' });
}