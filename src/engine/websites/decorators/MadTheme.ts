import { FetchRequest, FetchCSS } from '../../FetchProvider';
import { type MangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../../providers/MangaPlugin';
import * as Common from './Common';

interface MangaID {
    readonly slug: string;
}

const pathname = '/az-list?page={page}';
const queryMangaTitle = 'div.name.box h1';
const queryMangaListLinks = 'div.book-detailed-item div.thumb a';
const queryChapterListLinks = 'a';
const queryChapterTitle = 'strong.chapter-title';
const scriptPages = `return window.final_images`;

const DefaultInfoExtractor = Common.AnchorInfoExtractor(false);

/***************************************************
 ******** Manga from URL Extraction Methods ********
 ***************************************************/

/**
 * An extension method for extracting a single manga from the given {@link url} using the given CSS {@link query}.
 * The `pathname` of the given {@link url} and the detected `postID` will be used as identifier for the extracted manga.
 * When the CSS {@link query} matches a `meta` element, the manga title will be extracted from its `content` attribute, otherwise the `textContent` of the element will be used as manga title.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param provider - A reference to the {@link MangaPlugin} which shall be assigned as parent for the extracted manga
 * @param url - The url from which the manga shall be extracted
 * @param query - A CSS query to locate the element from which the manga title shall be extracted
 */
export async function FetchMangaCSS(this: MangaScraper, provider: MangaPlugin, url: string, query: string = queryMangaTitle): Promise<Manga> {
    const uri = new URL(url);
    const request = new FetchRequest(uri.href);
    const data = await FetchCSS(request, query);
    const slug = uri.pathname;
    const element = data[0];
    const title = (element instanceof HTMLMetaElement ? element.content : element.textContent).trim();
    return new Manga(this, provider, JSON.stringify({ slug }), title);
}

/**
 * A class decorator that adds the ability to extract a manga using the given CSS {@link query} from any url that matches the given {@link pattern}.
 * The `pathname` of the given {@link url} and the detected `postID` will be used as identifier for the extracted manga.
 * When the CSS {@link query} matches a `meta` element, the manga title will be extracted from its `content` attribute, otherwise the `textContent` of the element will be used as manga title.
 * @param pattern - An expression to check if a manga can be extracted from an url or not
 * @param query - A CSS query to locate the element from which the manga title shall be extracted
 */
export function MangaCSS(pattern: RegExp, query: string = queryMangaTitle) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T): T {
        return class extends ctor {
            public ValidateMangaURL(this: MangaScraper, url: string): boolean {
                return pattern.test(url);
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

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    const slug = anchor.pathname;
    const title = anchor.title.trim();
    const id = JSON.stringify({ slug });
    return { id, title };
}

/**
 * A class decorator that adds the ability to extract multiple mangas from a range of given relative {@link path} patterns using the given CSS {@link query}.
 * The range of all {@link path} patterns begins with 1 and is incremented until no more new mangas can be extracted.
 * This decorator utilizes the HTML pages which are targeted to be shown in the browser to extract the mangas.
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 * @param throttle - A delay [ms] for each request (only required for rate-limited websites)
 * @param path - The path pattern relative to the scraper's base url from which the mangas shall be extracted containing the placeholder `{page}` which is replaced by an incrementing number
 */
export function MangasMultiPageCSS(query = queryMangaListLinks, throttle = 0) {
    return Common.MangasMultiPageCSS(pathname, query, 1, throttle, MangaInfoExtractor);
}

/*************************************************
 ******** Chapter List Extraction Methods ********
 *************************************************/

function ChapterInfoExtractor(anchor: HTMLAnchorElement) {
    const slug = anchor.pathname;
    const title = anchor.querySelector(queryChapterTitle).textContent.trim();
    const id = JSON.stringify({ slug });
    return { id, title };
}

async function FetchChaptersCSS(this: MangaScraper, manga: Manga, request: FetchRequest, query = queryChapterListLinks, extract = DefaultInfoExtractor): Promise<Chapter[]> {
    const data = await FetchCSS<HTMLAnchorElement>(request, query);
    return data.map(element => {
        const { id, title } = extract.call(this, element);
        return new Chapter(this, manga, id, title);
    });
}

/**
 * An extension method for extracting all chapters for the given {@link manga} using the given CSS {@link query}.
 * The chapters are extracted from the composed url based on the `Identifier` of the {@link manga} and the `URI` of the website.
 * This method utilizes the HTML pages which are targeted to be shown in the browser to extract the chapters.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param manga - A reference to the {@link Manga} which shall be assigned as parent for the extracted chapters
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 */
export async function FetchChaptersSinglePageCSS(this: MangaScraper, manga: Manga, query = queryChapterListLinks, extract = DefaultInfoExtractor): Promise<Chapter[]> {
    const { slug } = JSON.parse(manga.Identifier) as MangaID;
    const uri = new URL('/api/manga' + slug + '/chapters?source=detail', this.URI);
    const request = new FetchRequest(uri.href);
    const chapters = await FetchChaptersCSS.call(this, manga, request, query, extract);
    if(!chapters.length) {
        throw new Error();
    } else {
        return chapters;
    }
}

/**
 * A class decorator that adds the ability to extract all chapters for a given manga from this website using the given CSS {@link query}.
 * The chapters are extracted from the composed url based on the `Identifier` of the manga and the `URI` of the website.
 * This decorator utilizes the HTML pages which are targeted to be shown in the browser to extract the chapters.
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 */
export function ChaptersSinglePageCSS(query = queryChapterListLinks, extract = ChapterInfoExtractor) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T): T {
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersSinglePageCSS.call(this, manga, query, extract);
            }
        };
    };
}


/**
 * A class decorator that adds the ability to extract all pages for a given chapter using the given JS {@link script}.
 * The pages are extracted from the composed url based on the `Identifier` of the chapter and the `URI` of the website.
 * @param script - A JS script to extract the image links
 */
export function PagesSinglePageJS(script: string = scriptPages) {
    return Common.PagesSinglePageJS(script, 2500);
}

/***********************************************
 ******** Image Data Extraction Methods ********
 ***********************************************/