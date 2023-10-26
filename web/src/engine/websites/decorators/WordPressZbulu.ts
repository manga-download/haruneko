import { FetchCSS, FetchRequest } from "../../FetchProvider";
import { Chapter, Manga, type MangaPlugin, type MangaScraper } from "../../providers/MangaPlugin";
import * as Common from './Common';

export const queryManga = 'div.comic-info div.info h1.name';
export const queryMangas = 'div.comics-grid div.entry div.content h3.name a';
export const queryChapters = 'div#chapterList div.chapters-wrapper div.r1 h2.chap a';
export const queryPages = 'div.chapter-content-inner img';

export const mangaTitleFilter = /(\s+manga|\s+webtoon|\s+others)+\s*$/gi;
export const chapterTitleFilter = /^\s*(\s+manga|\s+webtoon|\s+others)+/gi;
const chapterBloat = ['span', 'div.chapter-date'];
export const chapterPath = '{mangaid}/page-{page}/';
export const mangaPath = '/manga-list/page-{page}/';

export function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.text.replace(mangaTitleFilter, '').trim()
    };
}

export function ChapterExtractor(element: HTMLAnchorElement, mangatitle: string) {
    const id = element.pathname;

    //remove bloat badges
    for (const bloatCSS of chapterBloat) {
        while (element.querySelector(bloatCSS)) {
            const bloatNode = element.querySelector(bloatCSS);
            bloatNode.parentElement.removeChild(bloatNode);
        }
    }

    let title = element.text.trim();
    title = title.replace(mangatitle, '').replace(chapterTitleFilter, '').trim();
    return { id, title };
}

/**
 * An extension method for extracting a single manga from the given {@link url} using the given CSS {@link query}.
 * The `pathname` of the given {@link url}  will be used as identifier for the extracted manga.
 * When the CSS {@link query} matches a `meta` element, the manga title will be extracted from its `content` attribute, otherwise the `textContent` of the element will be used as manga title.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param provider - A reference to the {@link MangaPlugin} which shall be assigned as parent for the extracted manga
 * @param url - The url from which the manga shall be extracted
 * @param query - A CSS query to locate the element from which the manga title shall be extracted
 * @param titleFilter - A Regexp used to replace element in extracted manga title
 */
export async function FetchMangaCSS(this: MangaScraper, provider: MangaPlugin, url: string, query: string = queryManga, titleFilter = mangaTitleFilter): Promise<Manga> {
    const manga = await Common.FetchMangaCSS.call(this, provider, url, query);
    return new Manga(this, provider, manga.Identifier, manga.Title.replace(titleFilter, '').trim());
}

/**
 * A class decorator factory that adds the ability to extract a manga using the given CSS {@link query} from any url that matches the given {@link pattern}.
 * The `pathname` of the given {@link url} and the detected `postID` will be used as identifier for the extracted manga.
 * When the CSS {@link query} matches a `meta` element, the manga title will be extracted from its `content` attribute, otherwise the `textContent` of the element will be used as manga title.
 * @param pattern - An expression to check if a manga can be extracted from an url or not
 * @param query - A CSS query to locate the element from which the manga title shall be extracted
 * @param titleFilter - A Regexp used to replace element in extracted manga title
 */
export function MangaCSS(pattern: RegExp, query: string = queryManga, titleFilter: RegExp = mangaTitleFilter) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);

        return class extends ctor {
            public ValidateMangaURL(this: MangaScraper, url: string): boolean {
                return pattern.test(url);
            }
            public async FetchManga(this: MangaScraper, provider: MangaPlugin, url: string): Promise<Manga> {
                return await FetchMangaCSS.call(this, provider, url, query, titleFilter);
            }
        };
    };
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

        //***************************************************************************************************************************/
        // THE REASON WHY WE DONT USE Common.MangaMultiPagesCSS method is because on some ZBULU website we have PAGES OF DUPLICATES, it causes the loop
        // to stop at page 300+ when we have 900 pages to check. Duplicates are filtered manually at the end of the gathering.
        //***************************************************************************************************************************/

        mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        // TODO: Broadcast event that mangalist for provider has been updated?
    }

    const uniqueMangas = mangaList.filter((value, index, self) =>
        index === self.findIndex((t) => t.Identifier === value.Identifier));
    return uniqueMangas;
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

    const chapterlist: Chapter[]= [];
    let reducer = Promise.resolve();
    for (let page = start, run = true; run; page += step) {
        await reducer;
        reducer = throttle > 0 ? new Promise(resolve => setTimeout(resolve, throttle)) : Promise.resolve();
        const pathTopage = path.replace('{page}', `${page}`).replace('{mangaid}', manga.Identifier);
        const chapters = await FetchChaptersSinglePageCSS.call(this, manga, pathTopage, query);
        // Always add when mangaList is empty ... (length = 0)
        chapters.length > 0 && !EndsWith(chapterlist, chapters) ? chapterlist.push(...chapters) : run = false;
        // TODO: Broadcast event that mangalist for provider has been updated?
    }

    const uniqueChapters = chapterlist.filter((value, index, self) =>
        index === self.findIndex((t) => t.Identifier === value.Identifier));
    return uniqueChapters;
}

async function FetchChaptersSinglePageCSS(this: MangaScraper, manga: Manga, path: string, query = queryChapters): Promise<Chapter[]>{
    const url = new URL(path.replace('//', '/'), this.URI).href;
    const request = new FetchRequest(url);
    const data = await FetchCSS<HTMLAnchorElement>(request, query);
    return data.map(chapter => {
        const { id, title } = ChapterExtractor.call(this, chapter, manga.Title);
        return new Chapter(this, manga, id, title);
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