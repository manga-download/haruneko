import { FetchCSS } from '../../platform/FetchProvider';
import { type MangaScraper, type Manga, Chapter, type Page } from '../../providers/MangaPlugin';
import * as Common from './Common';

const scriptImageLinks = `
    new Promise(resolve => {
        const images = window.chapImages.split(',');
        resolve(images.map(image => window.mainServer ? window.mainServer+image : image));
    });
`;

const queryChapterListBloat = '.chapter-update';
const queryChapterListLinks = 'ul.chapter-list li a';
const DefaultInfoExtractor = Common.AnchorInfoExtractor(false, queryChapterListBloat);

/*************************************************
 ******** Chapter List Extraction Methods ********
 *************************************************/

/**
 * A class decorator that adds the ability to extract all chapters for a given manga from this website using the given CSS {@link query}.
 * This method utilizes the HTML pages provided by the **MadTheme Admin AJAX endpoint** to extract the chapters.
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 * @param extract - The extractor to use
 */
export function ChaptersSinglePageAJAX(query = queryChapterListLinks, extract = DefaultInfoExtractor) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersSinglePageAJAX.call(this, manga, query, extract);
            }
        };
    };
}

/**
 * An extension method for extracting all chapters for the given {@link manga} using the given CSS {@link query}.
 * This method utilizes the HTML pages provided by the **MadTheme Admin AJAX endpoint** to extract the chapters.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param manga - A reference to the {@link Manga} which shall be assigned as parent for the extracted chapters
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 * @param extract - The extractor to use
 */
export async function FetchChaptersSinglePageAJAX(this: MangaScraper, manga: Manga, query = queryChapterListLinks, extract = DefaultInfoExtractor): Promise<Chapter[]> {
    const id = manga.Identifier.split('/').pop();
    const uri = new URL(`/api/manga/${id}/chapters?source=detail`, this.URI);
    const request = new Request(uri.href);
    const data = await FetchCSS<HTMLAnchorElement>(request, query);
    return data.map(element => {
        const { id, title } = extract.call(this, element);
        return new Chapter(this, manga, id, title);
    });
}

/*************************************************
 ******** Pages Extraction Methods ********
 *************************************************/

/**
 * A class decorator that adds the ability to extract all pages for a given chapter using the given JS {@link script}.
 * The pages are extracted from the composed url based on the `Identifier` of the chapter and the `URI` of the website.
 * @param script - A JS script to extract the image links
 * @param delay - An initial delay [ms] before the {@link script} is executed
 */
export function PagesSinglePageJS(script = scriptImageLinks, delay = 0) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return Common.FetchPagesSinglePageJS.call(this, chapter, script, delay);
            }
        };
    };
}
