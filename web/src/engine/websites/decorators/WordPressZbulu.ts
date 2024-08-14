import { FetchCSS } from "../../platform/FetchProvider";
import { Chapter, type Manga, type MangaPlugin, type MangaScraper } from "../../providers/MangaPlugin";
import * as Common from './Common';

export const queryManga = 'div.comic-info div.info h1.name';
export const queryMangas = 'div.comics-grid div.entry div.content h3.name a';
export const queryChapters = 'div#chapterList div.chapters-wrapper div.r1 h2.chap a';
export const queryPages = 'div.chapter-content-inner img';

export const mangaTitleFilter = /(\s+manga|\s+webtoon|\s+others)+\s*$/gi;
export const chapterTitleFilter = /^\s*(\s+manga|\s+webtoon|\s+others)+/gi;
const chapterBloat = ['span', 'div.chapter-date'].join(',');
export const chapterPath = '{mangaid}/page-{page}/';
export const mangaPath = '/manga-list/page-{page}/';

export function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: CleanMangaTitle(anchor.text)
    };
}

export function MangaLabelExtractor(element: HTMLElement) {
    return element instanceof HTMLAnchorElement ? CleanMangaTitle(element.text) : CleanMangaTitle(element.textContent);
}

export function ChapterExtractor(element: HTMLAnchorElement) {
    const id = element.pathname;
    const title = element.text.trim().replace(chapterTitleFilter, '').trim();
    return { id, title };
}

/***********************************************
 ******** Manga List Extraction Methods ********
 ***********************************************/

/**
 * An extension method for extracting multiple mangas from a range of given relative {@link path} patterns using the given CSS {@link query}.
 * The range of all {@link path} patterns begins with {@link start} and is incremented by {@link step} until no more new mangas can be extracted.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param provider - A reference to the {@link MangaPlugin} which shall be assigned as parent for the extracted mangas
 * @param path - The path pattern relative to {@link this} scraper's base url from which the mangas shall be extracted containing the placeholder `{page}` which is replaced by an incrementing number
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 * @param start - The start for the sequence of incremental numbers which are applied to the {@link path} pattern
 * @param step - An int that will be used to increase page on each loop, so page can be used as an offset if needed
 * @param throttle - A delay [ms] for each request (only required for rate-limited websites)
 * @param extract - A function to extract the manga identifier and title from a single element (found with {@link query})
 */
export async function FetchMangasMultiPageCSS(this: MangaScraper, provider: MangaPlugin, path: string, query: string, start = 1, step = 1, throttle = 0, extract = MangaExtractor): Promise<Manga[]> {
    const mangaList : Manga[]= [];
    let reducer = Promise.resolve();
    for (let page = start, run = true; run; page += step) {
        await reducer;
        reducer = throttle > 0 ? new Promise(resolve => setTimeout(resolve, throttle)) : Promise.resolve();
        const mangas = await Common.FetchMangasSinglePageCSS.call(this, provider, path.replace('{page}', `${page}`), query, extract);

        // THE REASON WHY WE DONT USE Common.MangaMultiPagesCSS method is because on some ZBULU website we have PAGES OF DUPLICATES, it causes the loop
        // to stop at page 300+ when we have 900 pages to check. Duplicates are filtered manually at the end of the gathering.

        mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        // TODO: Broadcast event that mangalist for provider has been updated?
    }
    return mangaList.distinct();
}

/**
 * A class decorator that adds the ability to extract multiple mangas from a range of given relative {@link path} patterns using the given CSS {@link query}.
 * The range of all {@link path} patterns begins with {@link start} and is incremented by {@link step} until no more new mangas can be extracted.
 * @param path - The path pattern relative to the scraper's base url from which the mangas shall be extracted containing the placeholder `{page}` which is replaced by an incrementing number
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 * @param start - The start for the sequence of incremental numbers which are applied to the {@link path} pattern
 * @param step - An int that will be used to increase page on each loop, so page can be used as an offset if needed
 * @param throttle - A delay [ms] for each request (only required for rate-limited websites)
 * @param extract - A function to extract the manga identifier and title from a single element (found with {@link query})
 */
export function MangasMultiPageCSS(path: string = mangaPath, query: string = queryMangas, start = 1, step = 1, throttle = 0, extract = MangaExtractor) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);

        return class extends ctor {
            public async FetchMangas(this: MangaScraper, provider: MangaPlugin): Promise<Manga[]> {
                return FetchMangasMultiPageCSS.call(this, provider, path, query, start, step, throttle, extract);
            }
        };
    };
}

/*************************************************
 ******** Chapter List Extraction Methods ********
 *************************************************/
/**
 * @param query - A CSS query to locate the elements from which the chapter identifier shall be extracted
 * @param path - the subpath for chapter pagination
   @param start - The start for the sequence of incremental numbers which are applied to the {@link path} pattern
 * @param step - An int that will be used to increase page on each loop, so page can be used as an offset if needed
 * @param throttle - A delay [ms] for each request (only required for rate-limited websites) */

async function FetchChaptersMultiPageCSS(this: MangaScraper, manga: Manga, path: string = chapterPath, query: string = queryChapters,
    start: number = 1, step: number = 1, throttle: number = 0): Promise<Chapter[]> {

    const chapterList: Chapter[]= [];
    let reducer = Promise.resolve();
    for (let page = start, run = true; run; page += step) {
        await reducer;
        reducer = throttle > 0 ? new Promise(resolve => setTimeout(resolve, throttle)) : Promise.resolve();
        const pathTopage = path.replace('{page}', `${page}`).replace('{mangaid}', manga.Identifier);
        const chapters = await FetchChaptersSinglePageCSS.call(this, manga, pathTopage, query);
        chapters.length > 0 && !EndsWith(chapterList, chapters) ? chapterList.push(...chapters) : run = false;
    }
    return chapterList.distinct();
}

async function FetchChaptersSinglePageCSS(this: MangaScraper, manga: Manga, path: string, query = queryChapters): Promise<Chapter[]>{
    const request = new Request(new URL(path.replace('//', '/'), this.URI));
    const data = await FetchCSS<HTMLAnchorElement>(request, query);
    return data.map(chapter => {
        const { id, title } = Common.AnchorInfoExtractor(false, chapterBloat).call(this, chapter);
        return new Chapter(this, manga, id, title.replace(manga.Title, ''));
    });
}

export function EndsWith(target: Chapter[], source: Chapter[]) {
    if (target.length < source.length) {
        return false;
    }
    return target[target.length - 1].Identifier === source[source.length - 1].Identifier;
}

/**
 * A class decorator that adds the ability to extract all chapters for a given manga from this website using the given CSS {@link query}.
 * The chapters are extracted from the composed url based on the `Identifier` of the manga and the `URI` of the website.
 * @param query - A CSS query to locate the elements from which the chapter identifier shall be extracted
 * @param path - the path for chapter pagination
 * @param start - The start for the sequence of incremental numbers which are applied to the {@link path} pattern
 * @param step - An int that will be used to increase page on each loop, so page can be used as an offset if needed
 * @param throttle - A delay [ms] for each request (only required for rate-limited websites) */

export function ChaptersMultiPageCSS(path: string = chapterPath, query: string = queryChapters, start: number = 1, step: number = 1, throttle: number = 0) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);

        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return await FetchChaptersMultiPageCSS.call(this, manga, path, query, start, step, throttle);
            }
        };
    };
}

function CleanMangaTitle(title: string): string {
    return title.replace(mangaTitleFilter, '').trim();
}
