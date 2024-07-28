import { type MangaScraper, type Manga, type MangaPlugin } from '../../providers/MangaPlugin';
import * as Common from './Common';

export function ChapterInfoExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname + '/all-pages';
    const title = anchor.querySelector('span.val').textContent.replace(/\s*-/, '').trim();
    return { id, title };
}

const DefaultInfoExtractor = Common.AnchorInfoExtractor(false);

export const queryMangaTitle = [
    'h5.widget-heading',
    'h1.page-title'
].join(',');

export const queryMangas = [
    'div.content ul.manga-list li a.manga-info-qtip',
    '.poster a',
].join(',');

export const queryChapters = [
    '.episodes-list .item',
    'div#chapter_list ul.chapter-list li a',
].join(',');

export const queryPages = [
    'div.inner-page img.img-responsive',
    'div.ch-images img.img-responsive',
].join(',');

export const pathname = '/manga-list/';

/***********************************************
 ******** Manga List Extraction Methods ********
 ***********************************************/

/**
 * An extension method for extracting multiple mangas from the given relative {@link path} using the given CSS {@link query}.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param provider - A reference to the {@link MangaPlugin} which shall be assigned as parent for the extracted mangas
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 * @param path - The path relative to {@link this} scraper's base url from which the mangas shall be extracted
 * @param extract - A custom extractor for manga infos
 */
async function FetchMangasMultiPageCSS(this: MangaScraper, provider: MangaPlugin, query = queryMangas, path = pathname, extract = DefaultInfoExtractor): Promise<Manga[]> {
    const mangalist : Manga[] = [];
    const paths = [''].concat('abcdefghijklmnopqrstuvwxyz'.split(''));
    for (const letter of paths) {
        mangalist.push(... await Common.FetchMangasSinglePageCSS.call(this, provider, path + letter, query, extract));
    }
    return mangalist;
}

/**
 * A class decorator that adds the ability to extract multiple mangas from a range of pages using the given CSS {@link query}.
 * The range begins with 1 and is incremented until no more new mangas can be extracted.
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 * @param path - An additional prefix for the endpoint relative to the scraper's base url
 * @param extract - A custom extractor for manga infos
  */
export function MangasMultiPageCSS(query = queryMangas, path = pathname, extract = DefaultInfoExtractor ) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchMangas(this: MangaScraper, provider: MangaPlugin): Promise<Manga[]> {
                return FetchMangasMultiPageCSS.call(this, provider, query, path, extract);
            }
        };
    };
}
