import { FetchCSS } from '../../platform/FetchProvider';
import { type MangaScraper, type MangaPlugin, Manga, type Chapter, type Page } from '../../providers/MangaPlugin';
import * as Common from './Common';

const pathpaged = '/genre-all/{page}';
const queryMangaTitle = 'div.panel-story-info div.story-info-right h1';
const queryMangaListLinks = 'div.genres-item-info h3 a.genres-item-name';
const queryChapterListLinks = [
    'ul.row-content-chapter li a.chapter-name', // manganato, mangabat
    'div.chapter_list ul li a', // mangairo
    'div.chapter-list div.row span a', // mangakakalot(s), kissmangawebsite, manganeloinfo
    'div.content.mCustomScrollbar div.chapter-list ul li.row div.chapter h4 a.xanh' // MangaPark
].join(', ');
const queryPageListLinks = [
    'div.container-chapter-reader img', // manganato, mangabat
    'div.chapter-content div.panel-read-story img', // mangairo
    'div#vungdoc img, div.vung-doc img, div.vung_doc img' // mangakakalot(s), kissmangawebsite, manganeloinfo
].join(', ');

function AnchorInfoExtractor(this: MangaScraper, element: HTMLAnchorElement) {
    return {
        id: element.origin === this.URI.origin ? element.pathname : element.href,
        title: element.text.trim()
    };
}

/***************************************************
 ******** Manga from URL Extraction Methods ********
 ***************************************************/

// TODO?: Apply this.mangaTitleFilter = /(\s+manga|\s+webtoon|\s+others)+\s*$/gi;
// TODO?: Apply this.cfMailDecrypt(element);

/**
 * An extension method for extracting a single manga from the given {@link url} using the given CSS {@link query}.
 * For same-site references the `pathname` of the given {@link url} will be used as identifier for the extracted manga, for cross-site references the `href` will be used.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param provider - A reference to the {@link MangaPlugin} which shall be assigned as parent for the extracted manga
 * @param url - The url from which the manga shall be extracted
 * @param query - A CSS query to locate the element from which the manga title shall be extracted
 */
export async function FetchMangaCSS(this: MangaScraper, provider: MangaPlugin, url: string, query: string = queryMangaTitle): Promise<Manga> {
    const uri = new URL(url);
    const request = new Request(uri.href);
    const element = (await FetchCSS<HTMLElement>(request, query)).shift();
    return new Manga(this, provider, uri.origin === this.URI.origin ? uri.pathname : uri.href, element.textContent.trim());
}

/**
 * A class decorator that adds the ability to extract a manga using the given CSS {@link query} from any url that matches the given {@link pattern}.
 * For same-site references the `pathname` of the given {@link url} will be used as identifier for the extracted manga, for cross-site references the `href` will be used.
 * @param pattern - An expression to check if a manga can be extracted from an url or not, it may contain the placeholders `{origin}` and `{hostname}` which will be replaced with the corresponding parameters based on the website's base URL
 * @param query - A CSS query to locate the element from which the manga title shall be extracted
 */
export function MangaCSS(pattern: RegExp, query: string = queryMangaTitle) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public ValidateMangaURL(this: MangaScraper, url: string): boolean {
                const source = pattern.source.replaceAll('{origin}', this.URI.origin).replaceAll('{hostname}', this.URI.hostname);
                return new RegExp(source, pattern.flags).test(url);
            }
            public async FetchManga(this: MangaScraper, provider: MangaPlugin, url: string): Promise<Manga> {
                return FetchMangaCSS.call(this, provider, url, query);
            }
        };
    };
}

/***********************************************
 ******** Manga List Extraction Methods ********
 ***********************************************/

// TODO?: Apply this.mangaTitleFilter = /(\s+manga|\s+webtoon|\s+others)+\s*$/gi;
// TODO?: Apply this.cfMailDecrypt(element);

/**
 * An extension method for extracting multiple mangas from a range of given relative {@link path} patterns using the given CSS {@link query}.
 * The range of all {@link path} patterns begins with `1` and is incremented until no more new mangas can be extracted.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param provider - A reference to the {@link MangaPlugin} which shall be assigned as parent for the extracted mangas
 * @param path - The path pattern relative to {@link this} scraper's base url from which the mangas shall be extracted containing the placeholder `{page}` which is replaced by an incrementing number
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 */
export async function FetchMangasMultiPageCSS(this: MangaScraper, provider: MangaPlugin, path = pathpaged, query = queryMangaListLinks): Promise<Manga[]> {
    return Common.FetchMangasMultiPageCSS.call(this, provider, path, query, 1, 1, 0, AnchorInfoExtractor);
}

/**
 * A class decorator that adds the ability to extract multiple mangas from a range of given relative {@link path} patterns using the given CSS {@link query}.
 * The range of all {@link path} patterns begins with `1` and is incremented until no more new mangas can be extracted.
 * @param path - The path pattern relative to the scraper's base url from which the mangas shall be extracted containing the placeholder `{page}` which is replaced by an incrementing number
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 */
export function MangasMultiPageCSS(path: string = pathpaged, query: string = queryMangaListLinks) {
    return Common.MangasMultiPageCSS(path, query, 1, 1, 0, AnchorInfoExtractor);
}

/*************************************************
 ******** Chapter List Extraction Methods ********
 *************************************************/

// TODO?: Apply this.chapterTitleFilter = /(\s+manga|\s+webtoon|\s+others)+\s*$/gi;
// TODO?: Apply this.cfMailDecrypt(element);

/**
 * An extension method for extracting all chapters for the given {@link manga} using the given CSS {@link query}.
 * The chapters are extracted from the composed url based on the `Identifier` of the {@link manga} and the `URI` of the website.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param manga - A reference to the {@link Manga} which shall be assigned as parent for the extracted chapters
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 */
export async function FetchChaptersSinglePageCSS(this: MangaScraper, manga: Manga, query = queryChapterListLinks): Promise<Chapter[]> {
    return Common.FetchChaptersSinglePageCSS.call(this, manga, query, AnchorInfoExtractor);
}

/**
 * A class decorator that adds the ability to extract all chapters for a given manga from this website using the given CSS {@link query}.
 * The chapters are extracted from the composed url based on the `Identifier` of the manga and the `URI` of the website.
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 */
export function ChaptersSinglePageCSS(query: string = queryChapterListLinks) {
    return Common.ChaptersSinglePageCSS(query, AnchorInfoExtractor);
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
 */
export async function FetchPagesSinglePageCSS(this: MangaScraper, chapter: Chapter, query: string = queryPageListLinks): Promise<Page[]> {
    return Common.FetchPagesSinglePageCSS.call(this, chapter, query);
}

/**
 * A class decorator that adds the ability to extract all pages for a given chapter using the given CSS {@link query}.
 * The pages are extracted from the composed url based on the `Identifier` of the chapter and the `URI` of the website.
 * @param query - A CSS query to locate the elements from which the page information shall be extracted
 */
export function PagesSinglePageCSS(query: string = queryPageListLinks) {
    return Common.PagesSinglePageCSS(query);
}

/***********************************************
 ******** Image Data Extraction Methods ********
 ***********************************************/
