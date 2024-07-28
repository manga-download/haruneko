import type { Chapter, Manga, MangaScraper, Page } from '../../providers/MangaPlugin';
import * as Common from './Common';

export const SinApi = 'SinMH';
export const path = '/list_{page}/';
export const queryManga = 'div.book-cont div.book-detail div.book-title h1';
export const queryMangas = 'ul#contList li p.ell a';
export const queryChapters = 'div.comic-chapters ul li a';
export const queryChaptersScript = `
    new Promise(resolve => {
        const button = document.querySelector('#checkAdult');
        if (button) {
            button.click();
        }
        const chapterList = [...document.querySelectorAll('{queryChapters}')].map(element => {
            return {
                id: new URL(element.href, window.location).pathname,
                title: element.text.trim().replace(/\\d+p$/, ''),
                language: ''
            };
        });
        resolve(chapterList);
    });
`;

export const queryPagesScript = `
    new Promise(resolve => {
        const pageList = [];
        const pages = {api}.getChapterImageCount();
        for (let page = 1; page <= pages; page++) {
            pageList.push({api}.getChapterImage(page));
        }
        resolve(pageList);
    });
`;

/**
 * An extension method for extracting all chapters for the given {@link manga} using the given JS {@link script}.
 * The chapters are extracted from the composed url based on the `Identifier` of the {@link manga} and the `URI` of the website.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param manga - A reference to the {@link Manga} which shall be assigned as parent for the extracted chapters
 * @param script - A JS script to extract a list of entries with each entry containing the identifier and title property from which the chapters are composed
 * @param queryChap - CSS selector to get chapters
 * @param delay - An initial delay [ms] before the {@link script} is executed
 */
export async function FetchChaptersSinglePageJS(this: MangaScraper, manga: Manga, script: string, queryChap = queryChapters, delay = 0): Promise<Chapter[]> {
    const finalscript = script.replace('{queryChapters}', queryChap);
    return Common.FetchChaptersSinglePageJS.call(this, manga, finalscript, delay);
}

/**
 * A class decorator that adds the ability to extract all chapters for a given manga from this website using the given JS {@link script}.
 * The chapters are extracted from the composed url based on the `Identifier` of the manga and the `URI` of the website.
 * @param script - A JS script to extract a list of entries with each entry containing the identifier and title property from which the chapters are composed
 * @param queryChap - CSS selector to get chapters
 * @param delay - An initial delay [ms] before the {@link script} is executed
 */
export function ChaptersSinglePageJS(script: string, queryChap = queryChapters, delay = 0) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersSinglePageJS.call(this, manga, script, queryChap, delay);
            }
        };
    };
}

/*************************************************
 ******** Pages Extraction Methods ********
 *************************************************/

/**
 * An extension method for extracting all pages for the given {@link chapter} using the given JS {@link script}.
 * The pages are extracted from the composed url based on the `Identifier` of the {@link chapter} and the `URI` of the website.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param chapter - A reference to the {@link Chapter} which shall be assigned as parent for the extracted pages
 * @param script - A JS script to extract the image links
 * @param api - Api object name to call in script. Default 'SinMH'
 * @param delay - An initial delay [ms] before the {@link script} is executed
 */
async function FetchPagesSinglePageJS(this: MangaScraper, chapter: Chapter, script: string = queryPagesScript, api: string = SinApi, delay = 0): Promise<Page[]> {
    const finalscript = script.replaceAll('{api}', api);
    return Common.FetchPagesSinglePageJS.call(this, chapter, finalscript, delay);
}

/**
 * A class decorator that adds the ability to extract all pages for a given chapter using the given JS {@link script}.
 * The pages are extracted from the composed url based on the `Identifier` of the chapter and the `URI` of the website.
 * @param script - A JS script to extract the image links
 * @param api - Api object name to call in script. Default 'SinMH'
 * @param delay - An initial delay [ms] before the {@link script} is executed
 */
export function PagesSinglePageJS(script = queryPagesScript, api = SinApi, delay = 0) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);

        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesSinglePageJS.call(this, chapter, script, api, delay);
            }
        };
    };
}