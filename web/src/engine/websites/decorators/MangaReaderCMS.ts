import { FetchCSS } from '../../platform/FetchProvider';
import { type MangaScraper, Manga, type MangaPlugin } from '../../providers/MangaPlugin';
import * as Common from './Common';

export function ChapterInfoExtractor(element: HTMLElement) {
    const anchor: HTMLAnchorElement = element instanceof HTMLAnchorElement ? element : element.querySelector('a');
    const id = anchor.pathname;
    const title = element.innerText.replace(/\s*:\s*$/, '').trim();
    return { id, title };
}

export const queryMangas = [
    'ul.manga-list li a',
    'ul.manga-list-text li a.alpha-link',
    'ul.price-list li a'
].join(',');

export const queryChapters = [
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

export const queryPages = [
    'div#all img.img-responsive',
    'div.text-center img[loading="lazy"]',
].join(',');

export const queryMangaTitle = [
    'h1.widget-title',
    'h2.widget-title',
    'h2.listmanga-header'
].join(',');

const pathname = '/';
const DefaultInfoExtractor = Common.AnchorInfoExtractor(false);

/***********************************************
 ******** Manga List Extraction Methods ********
 ***********************************************/

/**
 * An extension method for extracting multiple mangas from the given relative {@link path} using the given CSS {@link query}.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param provider - A reference to the {@link MangaPlugin} which shall be assigned as parent for the extracted mangas
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 * @param path - The path relative to {@link this} scraper's base url from which the mangas shall be extracted
 * @param extract - A function to extract the manga identifier and title from a single element (found with {@link query})
 */
async function FetchMangasSinglePageCSS<E extends HTMLElement>(this: MangaScraper, provider: MangaPlugin, query = queryMangas, path = pathname, extract = DefaultInfoExtractor): Promise<Manga[]> {
    const request = new Request(new URL(path + 'changeMangaList?type=text', this.URI), {
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        }
    });
    const data = await FetchCSS<E>(request, query);
    return data.map(element => {
        const { id, title } = extract.call(this, element);
        return new Manga(this, provider, id, title);
    });
}

/**
 * A class decorator that adds the ability to extract multiple mangas from a range of pages using the given CSS {@link query}.
 * The range begins with 1 and is incremented until no more new mangas can be extracted.
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 * @param path - An additional prefix for the ajax endpoint relative to the scraper's base url
 * @param extract - A function to extract the manga identifier and title from a single element (found with {@link query})

 */
export function MangasSinglePageCSS(query = queryMangas, path = pathname, extract = DefaultInfoExtractor) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchMangas(this: MangaScraper, provider: MangaPlugin): Promise<Manga[]> {
                return FetchMangasSinglePageCSS.call(this, provider, query, path, extract);
            }
        };
    };
}

/**********************************************
 ******** Page List Extraction Methods ********
 **********************************************/

export function ChapterPageExtractor(this: MangaScraper, image: HTMLImageElement): string {
    try {
        const src = image.dataset['src'].split('://').pop();
        return decodeURIComponent(window.atob(src || undefined));
    } catch { // TODO: Do not return url for generic errors
        const src = (image.dataset['src'] || image.src).trim();
        return new URL(src, this.URI).href;
    }
}

/***********************************************
 ******** Image Data Extraction Methods ********
 ***********************************************/