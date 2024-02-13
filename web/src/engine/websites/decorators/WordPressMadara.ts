// https://mangabooth.com/product/wp-manga-theme-madara/

import { WebsiteResourceKey as R } from '../../../i18n/ILocale';
import { Exception } from '../../Error';
import { FetchCSS, FetchHTML } from '../../platform/FetchProvider';
import { type MangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../../providers/MangaPlugin';
import DeProxify from '../../transformers/ImageLinkDeProxifier';
import * as Common from './Common';

interface MangaID {
    readonly post: string;
    readonly slug: string;
}

const pathname = '';
const pathpaged = '/page/{page}/';
const queryMangaTitle = 'head meta[property="og:title"]';
const queryMangaListLinks = [
    'div.post-title h3 a',
    'div.post-title h5 a'
].join(', ');
const queryChapterListLinks = [
    'ul li.wp-manga-chapter > a',
    'ul li.wp-manga-chapter div.chapter-link a'
].join(', ');
const queryChapterListBloat = [
    'span.chapter-release-date'
].join(', ');
const queryPageListSelector = [
    'select#single-pager'
].join(', ');
const queryPageListLinks = 'div.page-break img';

const DefaultInfoExtractor = Common.AnchorInfoExtractor(false, queryChapterListBloat);

export const WPMangaProtectorPagesExtractorScript = `
    new Promise((resolve, reject) => {
        var imgdata = JSON.parse(CryptoJS.AES.decrypt(chapter_data, wpmangaprotectornonce, {
            format: CryptoJSAesJson
        }).toString(CryptoJS.enc.Utf8));
        resolve(JSON.parse(imgdata));
    });
`;

async function delay(milliseconds: number) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

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
    const request = new Request(uri.href);
    const data = await FetchHTML(request);
    const post = data.querySelector<HTMLElement>('div#manga-chapters-holder')?.dataset?.id
        || data.querySelector<HTMLInputElement>('input.rating-post-id')?.value
        || data.querySelector<HTMLElement>('a[data-post]')?.dataset?.post;
    const slug = uri.pathname;
    const element = data.querySelector<HTMLElement>(query);
    const title = (element instanceof HTMLMetaElement ? element.content : element.textContent).trim();
    return new Manga(this, provider, JSON.stringify({ post, slug }), title);
}

/**
 * A class decorator factory that adds the ability to extract a manga using the given CSS {@link query} from any url that matches the given {@link pattern}.
 * The `pathname` of the given {@link url} and the detected `postID` will be used as identifier for the extracted manga.
 * When the CSS {@link query} matches a `meta` element, the manga title will be extracted from its `content` attribute, otherwise the `textContent` of the element will be used as manga title.
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

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    const container = anchor.closest<HTMLElement>('div.page-item-detail, div.manga');
    const post = container?.querySelector<HTMLElement>('div[data-post-id]')?.dataset?.postId || '';
    const slug = anchor.pathname;
    const title = anchor.text.trim();
    const id = JSON.stringify({ post, slug });
    return { id, title };
}

/**
 * An extension method for extracting multiple mangas from a range of given relative {@link path} patterns using the given CSS {@link query}.
 * The range of all {@link path} patterns begins with 1 and is incremented until no more new mangas can be extracted.
 * This method utilizes the HTML pages which are targeted to be shown in the browser to extract the mangas.
 * **NOTE:** Only use this function if {@link FetchMangasMultiPageAJAX} is blocked by the website
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param provider - A reference to the {@link MangaPlugin} which shall be assigned as parent for the extracted mangas
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 * @param throttle - A delay [ms] for each request (only required for rate-limited websites)
 * @param path - The path pattern relative to {@link this} scraper's base url from which the mangas shall be extracted containing the placeholder `{page}` which is replaced by an incrementing number
 */
export async function FetchMangasMultiPageCSS(this: MangaScraper, provider: MangaPlugin, query = queryMangaListLinks, throttle = 0, path = pathpaged): Promise<Manga[]> {
    return Common.FetchMangasMultiPageCSS.call(this, provider, path, query, 1, 1, throttle, MangaInfoExtractor);
}

/**
 * A class decorator that adds the ability to extract multiple mangas from a range of given relative {@link path} patterns using the given CSS {@link query}.
 * The range of all {@link path} patterns begins with 1 and is incremented until no more new mangas can be extracted.
 * This decorator utilizes the HTML pages which are targeted to be shown in the browser to extract the mangas.
 * **NOTE:** Only use this decorator if {@link MangasMultiPageAJAX} is blocked by the website
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 * @param throttle - A delay [ms] for each request (only required for rate-limited websites)
 * @param path - The path pattern relative to the scraper's base url from which the mangas shall be extracted containing the placeholder `{page}` which is replaced by an incrementing number
 */
export function MangasMultiPageCSS(query = queryMangaListLinks, throttle = 0, path = pathpaged) {
    return Common.MangasMultiPageCSS(path, query, 1, 1, throttle, MangaInfoExtractor);
}

/**
 * An extension method for extracting multiple mangas from a range of pages using the given CSS {@link query}.
 * The range begins with 1 and is incremented until no more new mangas can be extracted.
 * This method utilizes the HTML pages provided by the **WordPress Admin AJAX endpoint** to extract the mangas.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param provider - A reference to the {@link MangaPlugin} which shall be assigned as parent for the extracted mangas
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 * @param throttle - A delay [ms] for each request (only required for rate-limited websites)
 * @param path - An additional prefix for the ajax endpoint relative to {@link this} scraper's base url
 */
export async function FetchMangasMultiPageAJAX(this: MangaScraper, provider: MangaPlugin, query = queryMangaListLinks, throttle = 0, path = pathname): Promise<Manga[]> {
    const mangaList = [];
    // inject `madara.query_vars` into any website using wp-madara to see full list of supported vars
    const form = new URLSearchParams({
        'action': 'madara_load_more',
        'template': 'madara-core/content/content-archive',
        'vars[paged]': '0',
        'vars[post_type]': 'wp-manga',
        'vars[posts_per_page]': '250'
    });
    for (let page = 0, run = true; run; page++) {
        form.set('page', `${page}`);
        const uri = new URL(path + '/wp-admin/admin-ajax.php', this.URI);
        const request = new Request(uri.href, {
            method: 'POST',
            body: form.toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': this.URI.href
            }
        });
        const data = await FetchCSS<HTMLAnchorElement>(request, query);
        const mangas = data.map(element => {
            const { id, title } = MangaInfoExtractor(element);
            return new Manga(this, provider, id, title.trim());
        });
        mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        await delay(throttle);
    }
    return mangaList;
}

/**
 * A class decorator that adds the ability to extract multiple mangas from a range of pages using the given CSS {@link query}.
 * The range begins with 1 and is incremented until no more new mangas can be extracted.
 * This decorator utilizes the HTML pages provided by the **WordPress Admin AJAX endpoint** to extract the mangas.
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 * @param throttle - A delay [ms] for each request (only required for rate-limited websites)
 * @param path - An additional prefix for the ajax endpoint relative to the scraper's base url
 */
export function MangasMultiPageAJAX(query = queryMangaListLinks, throttle = 0, path = pathname) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchMangas(this: MangaScraper, provider: MangaPlugin): Promise<Manga[]> {
                return FetchMangasMultiPageAJAX.call(this, provider, query, throttle, path);
            }
        };
    };
}

/*************************************************
 ******** Chapter List Extraction Methods ********
 *************************************************/

async function FetchChaptersCSS(this: MangaScraper, manga: Manga, request: Request, query = queryChapterListLinks, extract = DefaultInfoExtractor): Promise<Chapter[]> {
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
    const uri = new URL(slug, this.URI);
    const request = new Request(uri.href);
    const chapters = await FetchChaptersCSS.call(this, manga, request, query, extract);
    if(!chapters.length) {
        throw new Exception(R.Plugin_Common_Chapter_InvalidError);
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
export function ChaptersSinglePageCSS(query = queryChapterListLinks, extract = DefaultInfoExtractor) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersSinglePageCSS.call(this, manga, query, extract);
            }
        };
    };
}

/**
 * An extension method for extracting all chapters for the given {@link manga} using the given CSS {@link query}.
 * This method utilizes the HTML pages provided by the **WordPress Admin AJAX endpoint** to extract the chapters.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param manga - A reference to the {@link Manga} which shall be assigned as parent for the extracted chapters
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 * @param path - An additional prefix for the ajax endpoint relative to {@link this} scraper's base url
 */
export async function FetchChaptersSinglePageAJAXv1(this: MangaScraper, manga: Manga, query = queryChapterListLinks, path = pathname, extract = DefaultInfoExtractor): Promise<Chapter[]> {
    const id = JSON.parse(manga.Identifier) as MangaID;
    const uri = new URL(path + '/wp-admin/admin-ajax.php', this.URI);
    const request = new Request(uri.href, {
        method: 'POST',
        body: new URLSearchParams({
            'action': 'manga_get_chapters',
            'manga': id.post
        }).toString(),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': this.URI.href
        }
    });
    return FetchChaptersCSS.call(this, manga, request, query, extract);
}

/**
 * A class decorator that adds the ability to extract all chapters for a given manga from this website using the given CSS {@link query}.
 * This method utilizes the HTML pages provided by the **WordPress Admin AJAX endpoint** to extract the chapters.
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 * @param path - An additional prefix for the ajax endpoint relative to {@link this} scraper's base url
 */
export function ChaptersSinglePageAJAXv1(query = queryChapterListLinks, path = pathname, extract = DefaultInfoExtractor) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersSinglePageAJAXv1.call(this, manga, query, path, extract);
            }
        };
    };
}

/**
 * An extension method for extracting all chapters for the given {@link manga} using the given CSS {@link query}.
 * This method utilizes the HTML pages provided by the **WordPress Chapter AJAX endpoint** to extract the chapters.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param manga - A reference to the {@link Manga} which shall be assigned as parent for the extracted chapters
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 */
export async function FetchChaptersSinglePageAJAXv2(this: MangaScraper, manga: Manga, query = queryChapterListLinks, extract = DefaultInfoExtractor): Promise<Chapter[]> {
    const id = JSON.parse(manga.Identifier) as MangaID;
    const uri = new URL((id.slug + '/ajax/chapters/').replace(/\/+/g, '/'), this.URI);
    const request = new Request(uri.href, {
        method: 'POST',
        headers: {
            'Referer': this.URI.href
        }
    });
    return FetchChaptersCSS.call(this, manga, request, query, extract);
}

/**
 * A class decorator that adds the ability to extract all chapters for a given manga from this website using the given CSS {@link query}.
 * This method utilizes the HTML pages provided by the **WordPress Chapter AJAX endpoint** to extract the chapters.
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 */
export function ChaptersSinglePageAJAXv2(query = queryChapterListLinks, extract = DefaultInfoExtractor) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersSinglePageAJAXv2.call(this, manga, query, extract);
            }
        };
    };
}

/**********************************************
 ******** Page List Extraction Methods ********
 **********************************************/

function ChapterPageExtractor(this: MangaScraper, image: HTMLImageElement): string {
    const url = image.dataset?.src || image.dataset?.lazySrc || image.srcset || image.src;
    const uri = new URL(url.trim(), this.URI);
    return DeProxify(uri).href;
}

/**
 * An extension method for extracting all pages for the given {@link chapter} using the given CSS {@link query}.
 * The pages are extracted from the composed url based on the `Identifier` of the {@link chapter} and the `URI` of the website.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param chapter - A reference to the {@link Chapter} which shall be assigned as parent for the extracted pages
 * @param query - A CSS query to locate the elements from which the page information shall be extracted
 */
export async function FetchPagesSinglePageCSS(this: MangaScraper, chapter: Chapter, query = queryPageListLinks): Promise<Page[]> {
    const uri = new URL(chapter.Identifier, this.URI);
    let request = new Request(uri.href);
    const [ body ] = await FetchCSS<HTMLBodyElement>(request, 'body');
    let data: HTMLImageElement[] = [];
    if(body.querySelector(queryPageListSelector)) {
        uri.searchParams.set('style', 'list');
        request = new Request(uri.href);
        data = await FetchCSS<HTMLImageElement>(request, query);
    } else {
        data = [...body.querySelectorAll<HTMLImageElement>(query)];
    }
    return data.map(element => {
        const link = new URL(ChapterPageExtractor.call(this, element), request.url);
        return new Page(this, chapter, link, { Referer: uri.href });
    });
}

/**
 * A class decorator that adds the ability to extract all pages for a given chapter using the given CSS {@link query}.
 * The pages are extracted from the composed url based on the `Identifier` of the chapter and the `URI` of the website.
 * @param query - A CSS query to locate the elements from which the page information shall be extracted
 */
export function PagesSinglePageCSS(query = queryPageListLinks) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
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
