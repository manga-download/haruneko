import { FetchCSS } from '../../platform/FetchProvider';
import { Chapter, type Manga, type MangaScraper } from '../../providers/MangaPlugin';
import * as Common from './Common';

export const queryMangatitle = 'section img.object-cover';
export const queryMangas = 'div#card-real a';
export const mangaPath = '/manga?page={page}';
export const queryPages = 'div#chapter-container img.chapter-image';
export const queryChapters = 'div#chapters-list a';

export function MangaLabelExtractor(element: HTMLImageElement): string {
    return element.alt.trim();
}
export function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector<HTMLImageElement>('img').getAttribute('alt').trim()
    };
}

export function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('span').textContent.trim()
    };
}

/*************************************************
 ******** Chapter List Extraction Methods ********
 *************************************************/

/**
 * An extension method for extracting all chapters for the given {@link manga} using the given CSS {@link query}.
 * The chapters are extracted from the composed url based on the `Identifier` of the {@link manga} and the `URI` of the website.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param manga - A reference to the {@link Manga} which shall be assigned as parent for the extracted chapters
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 * @param extractor - An Extractor to get chapter infos
 */
export async function FetchChaptersMultiPageCSS(this: MangaScraper, manga: Manga, query = queryChapters, extractor = ChapterExtractor): Promise<Chapter[]> {
    const chapterList = [];
    for (let page = 1, run = true; run; page++) {
        const chapters = await GetChaptersFromPage.call(this, manga, page, query, extractor);
        chapters.length > 0 ? chapterList.push(...chapters) : run = false;
    }
    return chapterList.distinct();
}
async function GetChaptersFromPage(this: MangaScraper, manga: Manga, page: number, query = queryChapters, extractor = ChapterExtractor): Promise<Chapter[]> {
    const uri = new URL(`${manga.Identifier}?page=${page}`, this.URI);
    const data = await FetchCSS<HTMLAnchorElement>(new Request(uri), query);
    return data.map(element => {
        const { id, title } = extractor.call(this, element);
        return new Chapter(this, manga, id, title);
    });
}

/**
 * A class decorator that adds the ability to extract all chapters for a given manga from this website using the given CSS {@link query}.
 * The chapters are extracted from the composed url based on the `Identifier` of the manga and the `URI` of the website.
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 * @param extractor - An Extractor to get chapter infos
 */
export function ChaptersMultiPageCSS(query: string = queryChapters, extractor = ChapterExtractor) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersMultiPageCSS.call(this, manga, query, extractor);
            }
        };
    };
}