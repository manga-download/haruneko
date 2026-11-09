import type { MangaScraper, MangaPlugin, Manga, Chapter, Page } from '../../providers/MangaPlugin';
import * as Common from './Common';

const pathpaged = '/?page={page}';
const queryMangaTitle = 'div#content div.rm';
const queryMangaTitleLabel = 'h1[itemprop="name"]';
const queryMangaTitleLanguage = undefined;
const queryMangaListLinks = 'div.mng div.title h3';
const queryMangaListLinksAnchor = 'a.series';
const queryMangaListLinksLanguage = undefined;
const scriptPageListLinks = `app.items.map(item => item.src || item.isrc);`;

/***************************************************
 ******** Manga from URL Extraction Methods ********
 ***************************************************/

function CreateMangaLinkExtractor(queryLabel: string, queryLanguage: string) {
    return function (this: MangaScraper, element: HTMLElement, uri: URL) {
        const label = queryLabel ? element.querySelector<HTMLElement>(queryLabel) : element;
        const language = queryLanguage ? element.querySelector<HTMLElement>(queryLanguage)?.dataset?.lang : undefined;
        return {
            id: uri.pathname,
            title: label.textContent.trim() + (language ? ` [${language}]` : ''),
        };
    };
}

/**
 * An extension method for extracting a single manga from the given {@link url} using the given CSS {@link query}.
 * The `pathname` of the given {@link url} will be used as identifier for the extracted manga.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param provider - A reference to the {@link MangaPlugin} which shall be assigned as parent for the extracted manga
 * @param url - The url from which the manga shall be extracted
 * @param query - A CSS query to locate the element from which the manga title shall be extracted
 * @param queryLabel - A CSS sub-query to extract the label for the manga title from the element found by {@link query}
 * @param queryLanguage - A CSS sub-query to extract the language for the manga title from the element found by {@link query}
 */
export async function FetchMangaCSS(this: MangaScraper, provider: MangaPlugin, url: string, query: string = queryMangaTitle, queryLabel: string = queryMangaTitleLabel, queryLanguage: string = queryMangaTitleLanguage): Promise<Manga> {
    return Common.FetchMangaCSS.call(this, provider, url, query, CreateMangaLinkExtractor(queryLabel, queryLanguage));
}

/**
 * A class decorator that adds the ability to extract a manga using the given CSS {@link query} from any url that matches the given {@link pattern}.
 * The `pathname` of the url will be used as identifier for the extracted manga.
 * @param pattern - An expression to check if a manga can be extracted from an url or not
 * @param query - A CSS query to locate the element from which the manga title shall be extracted
 * @param queryLabel - A CSS sub-query to extract the label for the manga title from the element found by {@link query}
 * @param queryLanguage - A CSS sub-query to extract the language for the manga title from the element found by {@link query}
 */
export function MangaCSS(pattern: RegExp, query: string = queryMangaTitle, queryLabel: string = queryMangaTitleLabel, queryLanguage: string = queryMangaTitleLanguage) {
    return Common.MangaCSS(pattern, query, CreateMangaLinkExtractor(queryLabel, queryLanguage));
}

/***********************************************
 ******** Manga List Extraction Methods ********
 ***********************************************/

function CreateMangaInfoExtractor(queryAnchor: string, queryLanguage: string) {
    return function (this: MangaScraper, element: HTMLElement) {
        const anchor = element.querySelector<HTMLAnchorElement>(queryAnchor);
        const language = queryLanguage ? element.querySelector<HTMLElement>(queryLanguage)?.dataset?.lang : undefined;
        return {
            id: anchor.pathname,
            title: anchor.text.trim() + (language ? ` [${language}]` : '')
        };
    };
}

/**
 * An extension method for extracting multiple mangas from a range of given relative {@link path} patterns using the given CSS {@link query}.
 * The range of all {@link path} patterns begins with `1` and is incremented until no more new mangas can be extracted.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param provider - A reference to the {@link MangaPlugin} which shall be assigned as parent for the extracted mangas
 * @param path - The path pattern relative to {@link this} scraper's base url from which the mangas shall be extracted containing the placeholder `{page}` which is replaced by an incrementing number
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 * @param queryAnchor - A CSS sub-query to extract the identifier and label for the manga title from the element found by {@link query}
 * @param queryLanguage - A CSS sub-query to extract the language for the manga title from the element found by {@link query}
 */
export async function FetchMangasMultiPageCSS(this: MangaScraper, provider: MangaPlugin, path = pathpaged, query = queryMangaListLinks, queryAnchor: string = queryMangaListLinksAnchor, queryLanguage = queryMangaListLinksLanguage): Promise<Manga[]> {
    return Common.FetchMangasMultiPageCSS.call(this, provider, query, Common.PatternLinkGenerator(path), 0, CreateMangaInfoExtractor(queryAnchor, queryLanguage));
}

/**
 * A class decorator that adds the ability to extract multiple mangas from a range of given relative {@link path} patterns using the given CSS {@link query}.
 * The range of all {@link path} patterns begins with `1` and is incremented until no more new mangas can be extracted.
 * @param path - The path pattern relative to the scraper's base url from which the mangas shall be extracted containing the placeholder `{page}` which is replaced by an incrementing number
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 * @param queryAnchor - A CSS sub-query to extract the identifier and label for the manga title from the element found by {@link query}
 * @param queryLanguage - A CSS sub-query to extract the language for the manga title from the element found by {@link query}
 */
export function MangasMultiPageCSS(path: string = pathpaged, query: string = queryMangaListLinks, queryAnchor: string = queryMangaListLinksAnchor, queryLanguage = queryMangaListLinksLanguage) {
    return Common.MangasMultiPageCSS(query, Common.PatternLinkGenerator(path), 0, CreateMangaInfoExtractor(queryAnchor, queryLanguage));
}

/*************************************************
 ******** Chapter List Extraction Methods ********
 *************************************************/

/**********************************************
 ******** Page List Extraction Methods ********
 **********************************************/

/**
 * An extension method for extracting all pages for the given {@link chapter} using the given JS {@link script}.
 * The pages are extracted from the composed url based on the `Identifier` of the {@link chapter} and the `URI` of the website.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param chapter - A reference to the {@link Chapter} which shall be assigned as parent for the extracted pages
 * @param script - A JS script to extract the image links
 */
export async function FetchPagesSinglePageJS(this: MangaScraper, chapter: Chapter, script: string = scriptPageListLinks): Promise<Page[]> {
    return Common.FetchPagesSinglePageJS.call(this, chapter, script, 2500);
}

/**
 * A class decorator that adds the ability to extract all pages for a given chapter using the given JS {@link script}.
 * The pages are extracted from the composed url based on the `Identifier` of the chapter and the `URI` of the website.
 * @param script - A JS script to extract the image links
 */
export function PagesSinglePageJS(script: string = scriptPageListLinks) {
    return Common.PagesSinglePageJS(script, 2500);
}

/***********************************************
 ******** Image Data Extraction Methods ********
 ***********************************************/
