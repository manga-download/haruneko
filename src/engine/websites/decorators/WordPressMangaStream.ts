// https://themesia.com/category/wordpress-themes/

import type { MangaScraper, MangaPlugin, Manga, Chapter, Page } from '../../providers/MangaPlugin';
import DeProxify from '../../transformers/ImageLinkDeProxifier';
import * as Common from './Common';

const pathname = '/manga/list-mode/';
const queryMangaTitle = 'div#content div.postbody article h1';
const queryMangaListLinks = 'div#content div.soralist ul li a.series';
const queryChapterListLinks = 'div#chapterlist ul li div.eph-num a';
const queryChapterListTitle = 'span.chapternum';
const queryChapterListTitleBloat: string = null;
const queryPageListLinks = 'div#readerarea img[src]:not([src=""])';

/***************************************************
 ******** Manga from URL Extraction Methods ********
 ***************************************************/

/**
 * An extension method for a {@link MangaScraper} instance, that can be used to extract a manga from a given url.
 * It will use the `pathname` of the url as manga id and the `content` attribute or `textContent` of the first element found by the given CSS {@link query} as manga title.
 * @param this A reference to the {@link MangaScraper}
 * @param provider A reference to the {@link MangaPlugin} which contains the manga
 * @param url The URL for the manga from which the data shall be fetched
 * @param query A CSS query for an HTML element that holds the title of the manga either in its `content` attribute or as inner text
 */
export async function FetchMangaCSS(this: MangaScraper, provider: MangaPlugin, url: string, query: string = queryMangaTitle): Promise<Manga> {
    return Common.FetchMangaCSS.call(this, provider, url, query);
}

/**
 * A class decorator for any {@link DecoratableMangaScraper} implementation, that will setup the {@link MangaScraper.ValidateMangaURL} method and overwrite the {@link MangaScraper.FetchManga} method with {@link FetchMangaCSS}.
 * @param matcher An expression to check if a given URL is a valid manga resource
 * @param query A CSS query for an HTML element that holds the title of the manga either in its `content` attribute or as inner text
 */
export function MangaCSS(matcher: RegExp, query: string = queryMangaTitle) {
    return Common.MangaCSS(matcher, query);
}

/***********************************************
 ******** Manga List Extraction Methods ********
 ***********************************************/

/**
 * An extension method for a {@link MangaScraper} instance, that can be used to extract a manga list by parsing a single URI of a webiste with the given CSS query.
 * @param this A reference to the {@link MangaScraper}
 * @param provider A reference to the {@link MangaPlugin} which contains the mangas
 * @param query A CSS query for all HTML anchor elements that are linked to a manga
 * @param path An URL path providing the list of mangas
 */
export async function FetchMangasSinglePageCSS(this: MangaScraper, provider: MangaPlugin, path = pathname, query = queryMangaListLinks): Promise<Manga[]> {
    return Common.FetchMangasSinglePageCSS.call(this, provider, path, query);
}

/**
* A class decorator for any {@link DecoratableMangaScraper} implementation, that will overwrite the {@link MangaScraper.FetchMangas} method with {@link FetchMangasSinglePageCSS}.
* @param query A CSS query to find all HTML elements that are linked to a manga
* @param path An URL path providing the list of mangas
*/
export function MangasSinglePageCSS(query: string = queryMangaListLinks, path: string = pathname) {
    return Common.MangasSinglePageCSS(path, query);
}

/*************************************************
 ******** Chapter List Extraction Methods ********
 *************************************************/

function CreateChapterInfoExtractor<T extends HTMLAnchorElement>(manga: Manga, queryTitle?: string, queryBloat?: string) {
    return (anchor: T) => {
        if(anchor.hostname === 'nofil.net' && anchor.pathname.includes('safeme')) {
            anchor.href = new URL(anchor.href).searchParams.get('url');
        }
        if (queryBloat) {
            for(const bloat of anchor.querySelectorAll(queryBloat)) {
                if (bloat.parentElement) {
                    bloat.parentElement.removeChild(bloat);
                }
            }
        }
        const id = anchor.pathname;
        let title = (queryTitle ? anchor.querySelector(queryTitle).textContent : anchor.text).trim();
        title = title.replace(manga.Title, '').trim() || manga.Title;
        return { id , title };
    };
}

export async function FetchChaptersSinglePageCSS(this: MangaScraper, manga: Manga, query = queryChapterListLinks, queryTitle = queryChapterListTitle, queryBloat = queryChapterListTitleBloat): Promise<Chapter[]> {
    return Common.FetchChaptersSinglePageCSS.call(this, manga, query, CreateChapterInfoExtractor(manga, queryTitle, queryBloat));
}

export function ChaptersSinglePageCSS(query: string = queryChapterListLinks, queryTitle = queryChapterListTitle, queryBloat = queryChapterListTitleBloat) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T): T {
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersSinglePageCSS.call(this, manga, query, queryTitle, queryBloat);
            }
        };
    };
}

/**********************************************
 ******** Page List Extraction Methods ********
 **********************************************/

function CreateImageExtractor(this: MangaScraper) {
    return (image: HTMLImageElement): string => {
        const url = image.dataset?.lazySrc || image.dataset?.src || image.getAttribute('original') || image.src;
        const uri = new URL(url.trim(), this.URI);
        return DeProxify(uri).href;
    };
}

/**
 * Extracts the pages from the HTML page of the given {@link chapter}.
 * @param this A reference to the {@link MangaScraper}
 * @param chapter A reference to the {@link Chapter} which contains the pages
 * @param query A CSS query for all HTML image elements
 */
export async function FetchPagesSinglePageCSS(this: MangaScraper, chapter: Chapter, query = queryPageListLinks): Promise<Page[]> {
    return Common.FetchPagesSinglePageCSS.call(this, chapter, query, CreateImageExtractor.call(this));
    // TODO: On fail try to get with browser => `window.ts_reader.params.sources.shift().images`
}

/**
 * A class decorator for any {@link DecoratableMangaScraper} implementation, that will overwrite the {@link MangaScraper.FetchPages} method with {@link FetchPagesSinglePageCSS}.
 * @param query A CSS query for all HTML image elements
 */
export function PagesSinglePageCSS(query = queryPageListLinks) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T): T {
        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesSinglePageCSS.call(this, chapter, query);
            }
        };
    };
}

/***********************************************
 ******** Image Data Extraction Methods ********
 ***********************************************/