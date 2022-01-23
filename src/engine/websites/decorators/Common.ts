import { FetchCSS, FetchRequest } from '../../FetchProvider';
import { MangaScraper, DecoratableMangaScraper, MangaPlugin, Manga, Chapter, Page } from '../../providers/MangaPlugin';

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
    return element.dataset.src || element.getAttribute('src') || '';
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
    return function DecorateClass<T extends { new(...args: any[]) : DecoratableMangaScraper }>(ctor: T): T {
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
    return function DecorateClass<T extends { new(...args: any[]) : DecoratableMangaScraper }>(ctor: T): T {
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
    return function DecorateClass<T extends { new(...args: any[]) : DecoratableMangaScraper }>(ctor: T): T {
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
    return function DecorateClass<T extends { new(...args: any[]) : DecoratableMangaScraper }>(ctor: T): T {
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
        return new Page(this, chapter, link, {});
    });
}

/**
 * A class decorator for any {@link DecoratableMangaScraper} implementation, that will overwrite the {@link MangaScraper.FetchPages} method with {@link FetchPagesSinglePageCSS}.
 */
export function PagesSinglePageCSS<E extends HTMLElement>(query: string, extract = DefaultImageExtractor as ImageExtractor<E>) {
    return function DecorateClass<T extends { new(...args: any[]) : DecoratableMangaScraper }>(ctor: T): T {
        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesSinglePageCSS.call(this, chapter, query, extract as ImageExtractor<HTMLElement>);
            }
        };
    };
}