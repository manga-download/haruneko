// https://themesia.com/category/wordpress-themes/
// https://themesia.com/mangastream-wordpress-theme/

import type { MangaScraper, MangaPlugin, Manga, Chapter, Page } from '../../providers/MangaPlugin';
import DeProxify from '../../transformers/ImageLinkDeProxifier';
import * as Common from './Common';

const pathname = '/manga/list-mode/';
const queryMangaTitle = 'div#content div.postbody article h1';
const queryMangaListLinks = 'div#content div.soralist ul li a.series';
const queryChapterListLinks = 'div#chapterlist ul li div.eph-num a:last-of-type';
const queryChapterListTitle = 'span.chapternum';
const queryChapterListBloat = [
    'span > span.date',
    'span.date',
    'span.chapterdate',
].join(', ');
const queryPageListLinks = [
    'div#readarea img[src]:not([src=""])',
    'div#readerarea img[src]:not([src=""])',
    'div.reader-area img[src]:not([src=""])',
].join(', ');
const scriptPageListLinks = `ts_reader_control.getImages();`;

/***************************************************
 ******** Manga from URL Extraction Methods ********
 ***************************************************/

export function MangaLabelExtractor(this: MangaScraper, element: HTMLElement) {
    return [
        /^Comic\s+/i,
        /^Komik\s+/i,
        /^Manga\s+/i,
        /^Manhwa\s+/i,
        /^Manhua\s+/i,
        /\s+Bahasa\s+Indonesia$/i,
    ].reduce((aggregator, pattern) => aggregator.replace(pattern, ''), (element instanceof HTMLMetaElement ? element.content : element.textContent).trim());
}

/**
 * An extension method for extracting a single manga from the given {@link url} using the given CSS {@link query}.
 * The `pathname` of the given {@link url} will be used as identifier for the extracted manga.
 * When the CSS {@link query} matches a `meta` element, the manga title will be extracted from its `content` attribute, otherwise the `textContent` of the element will be used as manga title.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param provider - A reference to the {@link MangaPlugin} which shall be assigned as parent for the extracted manga
 * @param url - The url from which the manga shall be extracted
 * @param query - A CSS query to locate the element from which the manga title shall be extracted
 */
export async function FetchMangaCSS(this: MangaScraper, provider: MangaPlugin, url: string, query: string = queryMangaTitle): Promise<Manga> {
    return Common.FetchMangaCSS.call(this, provider, url, query, MangaLabelExtractor);
}

/**
 * A class decorator that adds the ability to extract a manga using the given CSS {@link query} from any url that matches the given {@link pattern}.
 * The `pathname` of the url will be used as identifier for the extracted manga.
 * When the CSS {@link query} matches a `meta` element, the manga title will be extracted from its `content` attribute, otherwise the `textContent` of the element will be used as manga title.
 * @param pattern - An expression to check if a manga can be extracted from an url or not
 * @param query - A CSS query to locate the element from which the manga title shall be extracted
 */
export function MangaCSS(pattern: RegExp, query: string = queryMangaTitle) {
    return Common.MangaCSS(pattern, query, MangaLabelExtractor);
}

/***********************************************
 ******** Manga List Extraction Methods ********
 ***********************************************/

function MangaInfosExtractor(this: MangaScraper, anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: MangaLabelExtractor.call(this, anchor)
    };
}

/**
 * An extension method for extracting multiple mangas from the given relative {@link path} using the given CSS {@link query}.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param provider - A reference to the {@link MangaPlugin} which shall be assigned as parent for the extracted mangas
 * @param path - The path relative to {@link this} scraper's base url from which the mangas shall be extracted
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 */
export async function FetchMangasSinglePageCSS(this: MangaScraper, provider: MangaPlugin, path = pathname, query = queryMangaListLinks): Promise<Manga[]> {
    return Common.FetchMangasSinglePageCSS.call(this, provider, path, query, MangaInfosExtractor);
}

/**
 * A class decorator that adds the ability to extract multiple mangas from the given relative {@link path} using the given CSS {@link query}.
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 * @param path - The path relative to the scraper's base url from which the mangas shall be extracted
 */
export function MangasSinglePageCSS(query: string = queryMangaListLinks, path: string = pathname) {
    return Common.MangasSinglePageCSS(path, query, MangaInfosExtractor);
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
        let title = (anchor.querySelector<HTMLElement>(queryTitle)?.innerText ?? anchor.innerText).trim();
        title = title.replace(manga.Title, '').trim() || manga.Title;
        return { id, title };
    };
}

/**
 * An extension method for extracting all chapters for the given {@link manga} using the given CSS {@link query}.
 * The chapters are extracted from the composed url based on the `Identifier` of the {@link manga} and the `URI` of the website.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param manga - A reference to the {@link Manga} which shall be assigned as parent for the extracted chapters
 * @param query - A CSS query to locate the elements from which the chapter identifier shall be extracted
 * @param queryTitle - A CSS sub-query performed on each element found with {@link query} to extract the chapter title
 */
export async function FetchChaptersSinglePageCSS(this: MangaScraper, manga: Manga, query = queryChapterListLinks, queryTitle = queryChapterListTitle): Promise<Chapter[]> {
    return Common.FetchChaptersSinglePageCSS.call(this, manga, query, CreateChapterInfoExtractor(manga, queryTitle, queryChapterListBloat));
}

/**
 * A class decorator that adds the ability to extract all chapters for a given manga from this website using the given CSS {@link query}.
 * The chapters are extracted from the composed url based on the `Identifier` of the manga and the `URI` of the website.
 * @param query - A CSS query to locate the elements from which the chapter identifier shall be extracted
 * @param queryTitle - A CSS sub-query performed on each element found with {@link query} to extract the chapter title
 */
export function ChaptersSinglePageCSS(query: string = queryChapterListLinks, queryTitle = queryChapterListTitle) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersSinglePageCSS.call(this, manga, query, queryTitle);
            }
        };
    };
}

/**********************************************
 ******** Page List Extraction Methods ********
 **********************************************/

function ChapterPageExtractor(this: MangaScraper, image: HTMLImageElement): string {
    const url = image.dataset?.lazySrc || image.dataset?.src || image.getAttribute('original') || image.src;
    const uri = new URL(url.trim(), this.URI);
    return DeProxify(uri).href;
}

/**
 * An extension method for extracting all pages for the given {@link chapter} using the given CSS {@link query}.
 * The pages are extracted from the composed url based on the `Identifier` of the {@link chapter} and the `URI` of the website.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param chapter - A reference to the {@link Chapter} which shall be assigned as parent for the extracted pages
 * @param exclude - A list of patterns used to remove matching page links (e.g. ad images)
 * @param query - A CSS query to locate the elements from which the page information shall be extracted
 */
export async function FetchPagesSinglePageCSS(this: MangaScraper, chapter: Chapter, exclude: RegExp[] = [], query = queryPageListLinks): Promise<Page[]> {
    const pages = await Common.FetchPagesSinglePageCSS.call(this, chapter, query, ChapterPageExtractor.bind(this));
    return pages.filter(page => exclude.none(pattern => pattern.test(page.Link.pathname)));
}

/**
 * A class decorator that adds the ability to extract all pages for a given chapter using the given CSS {@link query}.
 * The pages are extracted from the composed url based on the `Identifier` of the chapter and the `URI` of the website.
 * @param exclude - A list of patterns used to remove matching page links (e.g. ad images)
 * @param query - A CSS query to locate the elements from which the page information shall be extracted
 */
export function PagesSinglePageCSS(exclude: RegExp[] = [], query = queryPageListLinks) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesSinglePageCSS.call(this, chapter, exclude, query);
            }
        };
    };
}

/**
 * An extension method for extracting all pages for the given {@link chapter} using the given JS {@link script}.
 * The pages are extracted from the composed url based on the `Identifier` of the {@link chapter} and the `URI` of the website.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param chapter - A reference to the {@link Chapter} which shall be assigned as parent for the extracted pages
 * @param exclude - A list of patterns used to remove matching page links (e.g. ad images)
 * @param script - A JS script to extract the image links
 * @param delay - An initial delay [ms] before the {@link script} is executed
 */
export async function FetchPagesSinglePageJS(this: MangaScraper, chapter: Chapter, exclude: RegExp[] = [], script = scriptPageListLinks, delay = 2500): Promise<Page[]> {
    const pages = await Common.FetchPagesSinglePageJS.call(this, chapter, script, delay);
    return pages.filter(page => exclude.none(pattern => pattern.test(page.Link.pathname)));
}

/**
 * A class decorator that adds the ability to extract all pages for a given chapter using the given JS {@link script}.
 * The pages are extracted from the composed url based on the `Identifier` of the chapter and the `URI` of the website.
 * @param exclude - A list of patterns used to remove matching page links (e.g. ad images)
 * @param script - A JS script to extract the image links
 * @param delay - An initial delay [ms] before the {@link script} is executed
 */
export function PagesSinglePageJS(exclude: RegExp[] = [], script = scriptPageListLinks, delay = 2500) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesSinglePageJS.call(this, chapter, exclude, script, delay);
            }
        };
    };
}

/***********************************************
 ******** Image Data Extraction Methods ********
 ***********************************************/