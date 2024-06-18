import { FetchCSS } from "../../platform/FetchProvider";
import { Chapter, type Manga, type MangaScraper} from "../../providers/MangaPlugin";
import { Page } from "../../providers/MangaPlugin";
import * as Common from './Common';

export function MangaLabelExtractor(element: HTMLElement) {
    let title = element.getAttribute('text') ? element.getAttribute('text') : element.textContent;
    title = title.replace(/\s*-\s*RAW$/i, '');
    return title.trim();
}
export function MangaExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    let title = anchor.getAttribute('text') ? anchor.getAttribute('text') : anchor.textContent;
    title = title.replace(/\s*-\s*RAW$/i, '').trim();
    return { id, title };
}

export const DefaultExcludes = [/3282f6a4b7_o/, /donate/];
export const pathSinglePageManga = '/manga-list.html?listType=allABC';
export const pathMultiPageManga = '/manga-list.html?page={page}';

export const queryMangaTitle = [
    'li:last-of-type span[itemprop="name"]',
    'ul.manga-info h3',
    'ul.manga-info h1',
].join(',');

export const queryMangas = [
    'span[data-toggle="mangapop"] a',
    'div.media h3.media-heading a',
    'div.container a[data-toggle="mangapop"]',
    'div.card-body div.series-title a'
].join(',');

export const queryChapters = [
    'div#tab-chapper table tr td a.chapter',
    'ul.list-chapters > a',
    'div#tab-chapper div#list-chapters span.title a.chapter'
].join(',');

export const queryChapterTitle = [
    'div.chapter-name',
].join(',');

export const queryPages = [
    'img.chapter-img',
    'div#chapter-content img',
    'div.chapter-content img'
].join(',');

/**********************************************
 ******** Chapters List Extraction Methods ******
 **********************************************/

/**
 * A class decorator that adds the ability to extract all chapters for a given manga from this website using the given CSS {@link query}.
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 */
export function ChaptersSinglePageCSS(query = queryChapters) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);

        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersSinglePageCSS.call(this, manga, query);
            }
        };
    };
}

/**
 * An extension method for extracting all chapters for the given {@link manga} using the given CSS {@link query}.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param manga - A reference to the {@link Manga} which shall be assigned as parent for the extracted chapters
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 */
export async function FetchChaptersSinglePageCSS(this: MangaScraper, manga: Manga, query = queryChapters): Promise<Chapter[]> {
    const url = new URL(manga.Identifier, this.URI);
    const request = new Request(url.href);
    const data = await FetchCSS<HTMLAnchorElement>(request, query);

    return data.map(anchor => {
        if (anchor.dataset.href) {
            anchor.setAttribute('href', anchor.dataset.href + anchor.getAttribute('href'));
        }
        const id = anchor.pathname;
        const titleElement = anchor.querySelector(queryChapterTitle);
        let title = titleElement ? titleElement.textContent.trim() : anchor.text.trim();
        //escape all special characters used in Javascript regexes
        const mangaTitle = manga.Title.replace(/\s*-\s*RAW$/i, '').replace(/[*^.|$?+\-()[\]{}\\/]/g, '\\$&');
        title = title.replace(new RegExp(mangaTitle, 'i'), '');
        title = title.replace(/^\s*-\s*/, '');
        title = title.replace(/-\s*-\s*Read\s*Online\s*$/, '').trim();
        return new Chapter(this, manga, id, title);
    }).distinct();
}

/**********************************************
 ******** Page List Extraction Methods ********
 **********************************************/

/**
 * An extension method for extracting all pages for the given {@link chapter} using the first match of the given regular expression {@link matchers}.
 * The pages are extracted from the composed url based on the `Identifier` of the {@link chapter} and the `URI` of the website.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param chapter - A reference to the {@link Chapter} which shall be assigned as parent for the extracted pages
 * @param query - CSS query to get chapter link
 */
export async function FetchPagesSinglePageCSS(this: MangaScraper, chapter: Chapter, query: string = queryPages, exclude: RegExp[] = DefaultExcludes): Promise<Page[]> {
    const uri = new URL(chapter.Identifier, this.URI);
    const request = new Request(uri.href);
    const data = await FetchCSS<HTMLImageElement>(request, query);
    const pages = data
        .map(element => {
            try {
                element.dataset.src = window.atob(element.dataset.src);
            } catch (_) { /* ignore */ }
            try {
                element.dataset.src = window.atob(element.dataset.srcset);
            } catch (_) { /* ignore */ }
            try {
                element.dataset.original = window.atob(element.dataset.original);
            } catch (_) { /* ignore */ }
            try {
                element.dataset.pagespeedLazySrc = window.atob(element.dataset.pagespeedLazySrc);
            } catch (_) { /* ignore */ }
            try {
                element.dataset.aload = window.atob(element.dataset.aload);
            } catch (_) { /* ignore */ }
            return element.dataset.aload || element.dataset.src || element.dataset.srcset || element.dataset.original || element.dataset.pagespeedLazySrc || element.src;
        });
    return pages.filter(url => !exclude.some(pattern => pattern.test(url))).map(page => new Page(this, chapter, new URL(page, this.URI), { Referer: this.URI.href }));
}

/**
 * A class decorator that adds the ability to extract all pages for the given {@link chapter} using the first match of the given regular expression {@link matchers}.
 * The pages are extracted from the composed url based on the `Identifier` of the chapter and the `URI` of the website.
 * @param query - CSS query to get chapter link
 */
export function PagesSinglePageCSS(query : string = queryPages, excludes : RegExp[] = DefaultExcludes) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);

        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesSinglePageCSS.call(this, chapter, query, excludes);
            }
        };
    };
}
