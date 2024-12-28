import { FetchCSS } from '../../platform/FetchProvider';
import { type MangaScraper, type Manga, Chapter } from '../../providers/MangaPlugin';
import * as Common from './Common';

export const scriptImageLinks = `window.chapImages.split(',').map(image => window.mainServer ? window.mainServer + image : image);`;
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
export function ChaptersSinglePageAJAXV1(query = queryChapterListLinks, extract = DefaultInfoExtractor) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersSinglePageAJAXV1.call(this, manga, query, extract);
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
export async function FetchChaptersSinglePageAJAXV1(this: MangaScraper, manga: Manga, query = queryChapterListLinks, extract = DefaultInfoExtractor): Promise<Chapter[]> {
    const id = manga.Identifier.split('/').at(-1);
    const data = await FetchCSS<HTMLAnchorElement>(new Request(new URL(`/api/manga/${id}/chapters?source=detail`, this.URI)), query);
    return data.map(element => {
        const { id, title } = extract.call(this, element);
        return new Chapter(this, manga, id, title);
    });
};

/**
 * A class decorator that adds the ability to extract all chapters for a given manga from this website using the given CSS {@link query}.
 * This method utilizes the HTML pages provided by the **MadTheme Admin AJAX endpoint** to extract the chapters.
 */
export function ChaptersSinglePageAJAXV2() {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersSinglePageAJAXV2.call(this, manga);
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
export async function FetchChaptersSinglePageAJAXV2(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
    const mangaid = manga.Identifier.match(/\/manga\/(\d+)-/)[1];
    const data = await FetchCSS<HTMLAnchorElement>(new Request(new URL(`/service/backend/chaplist/?manga_id=${mangaid}`, this.URI)), 'ul.chapter-list li a');
    return data.map(element => new Chapter(this, manga, element.pathname, element.querySelector('strong.chapter-title').textContent.trim()));
}