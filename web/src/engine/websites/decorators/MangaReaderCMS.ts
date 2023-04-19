import { FetchRequest, FetchCSS } from '../../FetchProvider';
import { type MangaScraper, Manga, type Chapter, type Page, type MangaPlugin } from '../../providers/MangaPlugin';
import * as Common from './Common';

function ChapterInfoExtractor(element : HTMLElement) {
    const anchor: HTMLAnchorElement = element.nodeName.toLowerCase() === 'a' ? element as HTMLAnchorElement : element.querySelector('a');
    const id = anchor.pathname;
    const title = element.innerText.replace(/\s*:\s*$/, '').trim();
    return { id, title };
}

const queryMangas = [
    'ul.manga-list li a',
    'ul.manga-list-text li a.alpha-link',
    'ul.price-list li a'
].join(',');

const queryChapters = [
    'ul.chapters li h3.chapter-title-rtl a',
    'ul.chapters li h5.chapter-title-rtl a',
    'ul.chapter-list li a',
    'div.chapters h3.chapter-title a',
    'div.chapter-wrapper table td.chapter a',
    'div.capitulos-list table tr td:first-of-type a',
    'ul li div.item a.chapter_num',
    'table.table--manga tbody td.table__chapter a',
    'ul.chapterszozo li a',
].join(',');

const queryPages = [
    'div#all img.img-responsive',
    'div.text-center img[loading="lazy"]',
].join(',');

const queryMangaTitle = [
    'h1.widget-title',
    'h2.widget-title',
    'h2.listmanga-header'
].join(',');

const pathname = '/';
const DefaultChapterExtractor = ChapterInfoExtractor;

/***************************************************
 ******** Manga from URL Extraction Methods ********
 ***************************************************/

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
    return Common.FetchMangaCSS.call(this, provider, url, query);
}

/**
 * A class decorator that adds the ability to extract a manga using the given CSS {@link query} from any url that matches the given {@link pattern}.
 * The `pathname` of the url will be used as identifier for the extracted manga.
 * When the CSS {@link query} matches a `meta` element, the manga title will be extracted from its `content` attribute, otherwise the `textContent` of the element will be used as manga title.
 * @param pattern - An expression to check if a manga can be extracted from an url or not
 * @param query - A CSS query to locate the element from which the manga title shall be extracted
 */
export function MangaCSS(pattern: RegExp, query: string = queryMangaTitle) {
    return Common.MangaCSS(pattern, query);
}

/***********************************************
 ******** Manga List Extraction Methods ********
 ***********************************************/

/**
 * An extension method for extracting multiple mangas from the given relative {@link path} using the given CSS {@link query}.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param provider - A reference to the {@link MangaPlugin} which shall be assigned as parent for the extracted mangas
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 * @param path - The path relative to {@link this} scraper's base url from which the mangas shall be extracted
 */
export async function FetchMangasSinglePageCSS(this: MangaScraper, provider: MangaPlugin, query = queryMangas, path = pathname): Promise<Manga[]> {
    const url = new URL(path + 'changeMangaList?type=text', this.URI);
    const request = new FetchRequest(url.href, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        }
    });
    const data = await FetchCSS<HTMLAnchorElement>(request, query);
    return data.map(element => {
        const id = element.pathname + element.search;
        const title = element.textContent.trim();
        return new Manga(this, provider, id, title.trim());
    });
}

/**
 * A class decorator that adds the ability to extract multiple mangas from a range of pages using the given CSS {@link query}.
 * The range begins with 1 and is incremented until no more new mangas can be extracted.
 * This decorator utilizes the HTML pages provided by the **WordPress Admin AJAX endpoint** to extract the mangas.
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 * @param path - An additional prefix for the ajax endpoint relative to the scraper's base url
 */
export function MangasSinglePageCSS(query = queryMangas, path = pathname) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T): T {
        return class extends ctor {
            public async FetchMangas(this: MangaScraper, provider: MangaPlugin): Promise<Manga[]> {
                return FetchMangasSinglePageCSS.call(this, provider, query, path);
            }
        };
    };
}

/*************************************************
 ******** Chapter List Extraction Methods ********
 *************************************************/

/**
 * A class decorator that adds the ability to extract all chapters for a given manga from this website using the given CSS {@link query}.
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 * @param extract - The extractor to use
 */

export function ChaptersSinglePageCSS(query = queryChapters, extract = DefaultChapterExtractor) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T): T {
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersSinglePageCSS.call(this, manga, query, extract);
            }
        };
    };
}

/**
 * An extension method for extracting all chapters for the given {@link manga} using the given CSS {@link query}.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param manga - A reference to the {@link Manga} which shall be assigned as parent for the extracted chapters
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 * @param extract - The extractor to use
 */

export async function FetchChaptersSinglePageCSS(this: MangaScraper, manga: Manga, query = queryChapters, extract = DefaultChapterExtractor): Promise<Chapter[]> {
    return Common.FetchChaptersSinglePageCSS.call(this, manga, query, extract);
}

/**********************************************
 ******** Page List Extraction Methods ********
 **********************************************/

function ChapterPageExtractor(this: MangaScraper, image: HTMLImageElement): string {
    try {
        const src = image.dataset['src'].split('://').pop();
        return decodeURIComponent(atob(src || undefined));
    } catch (error) {
        const src = (image.dataset['src'] || image.src).trim();
        return new URL(src, this.URI).href;
    }
}

/**
 * An extension method for extracting all pages for the given {@link chapter} using the given CSS {@link query}.
 * The pages are extracted from the composed url based on the `Identifier` of the {@link chapter} and the `URI` of the website.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param chapter - A reference to the {@link Chapter} which shall be assigned as parent for the extracted pages
 * @param query - A CSS query to locate the elements from which the page information shall be extracted
 */
export async function FetchPagesSinglePageCSS(this: MangaScraper, chapter: Chapter, query = queryPages): Promise<Page[]> {
    return await Common.FetchPagesSinglePageCSS.call(this, chapter, query, ChapterPageExtractor.bind(this));
}

/**
 * A class decorator that adds the ability to extract all pages for a given chapter using the given CSS {@link query}.
 * The pages are extracted from the composed url based on the `Identifier` of the chapter and the `URI` of the website.
 * @param query - A CSS query to locate the elements from which the page information shall be extracted
 */
export function PagesSinglePageCSS(query = queryPages) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T): T {
        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesSinglePageCSS.call(this, chapter,query);
            }
        };
    };
}

/***********************************************
 ******** Image Data Extraction Methods ********
 ***********************************************/