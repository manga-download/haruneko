// https://foolcode.github.io/FoOlSlide/

import { Fetch, FetchCSS } from '../../platform/FetchProvider';
import { type MangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../../providers/MangaPlugin';
import * as Common from './Common';

const pathpaged = '/directory/{page}/';
const queryMangaTitle = 'div.info h1.title';
const queryMangaListLinks = 'div.list div.group > div.title a';
const queryChapterListLinks = 'div.list div.element div.title a';
const regexPageListEntries = [
    /pages\s*=\s*(\[.*?\])\s*;/,
    /pages\s*=\s*JSON.parse\s*\(\s*atob\s*\("(.*?)"\s*\)\s*\)\s*;/
];

/***************************************************
 ******** Manga from URL Extraction Methods ********
 ***************************************************/

/**
 * An extension method for extracting a single manga from the given {@link url} using the given CSS {@link query}.
 * The `pathname` of the given {@link url} will be used as identifier for the extracted manga.
 * When the CSS {@link query} matches a `meta` element, the manga title will be extracted from its `content` attribute, otherwise the `textContent` of the element will be used as manga title.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param provider - A reference to the {@link MangaPlugin} which shall be assigned as parent for the extracted manga
 * @param url - The url from which the manga shall be extracted
 * @param query - A CSS query to locate the element from which the manga title shall be extracted
 */
export async function FetchMangaCSS(this: MangaScraper, provider: MangaPlugin, url: string, query: string = queryMangaTitle): Promise<Manga> {
    const request = new Request(url, {
        method: 'POST',
        body: 'adult=true',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    const data = (await FetchCSS<HTMLElement>(request, query)).shift();
    return new Manga(this, provider, new URL(url).pathname, Common.ElementLabelExtractor().call(this, data));
}

/**
 * A class decorator that adds the ability to extract a manga using the given CSS {@link query} from any url that matches the given {@link pattern}.
 * The `pathname` of the url will be used as identifier for the extracted manga.
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

/**
 * An extension method for extracting multiple mangas from a range of given relative {@link path} patterns using the given CSS {@link query}.
 * The range of all {@link path} patterns begins with `1` and is incremented until no more new mangas can be extracted.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param provider - A reference to the {@link MangaPlugin} which shall be assigned as parent for the extracted mangas
 * @param path - The path pattern relative to {@link this} scraper's base url from which the mangas shall be extracted containing the placeholder `{page}` which is replaced by an incrementing number
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 */
export async function FetchMangasMultipPageCSS(this: MangaScraper, provider: MangaPlugin, path = pathpaged, query = queryMangaListLinks): Promise<Manga[]> {
    return Common.FetchMangasMultiPageCSS.call(this, provider, path, query);
}

/**
 * A class decorator that adds the ability to extract multiple mangas from a range of given relative {@link path} patterns using the given CSS {@link query}.
 * The range of all {@link path} patterns begins with `1` and is incremented until no more new mangas can be extracted.
 * @param path - The path pattern relative to the scraper's base url from which the mangas shall be extracted containing the placeholder `{page}` which is replaced by an incrementing number
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 */
export function MangasMultiPageCSS(path: string = pathpaged, query: string = queryMangaListLinks) {
    return Common.MangasMultiPageCSS(path, query);
}

/*************************************************
 ******** Chapter List Extraction Methods ********
 *************************************************/

const ChapterInfoExtractor = Common.AnchorInfoExtractor();

/**
 * An extension method for extracting all chapters for the given {@link manga} using the given CSS {@link query}.
 * The chapters are extracted from the composed url based on the `Identifier` of the {@link manga} and the `URI` of the website.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param manga - A reference to the {@link Manga} which shall be assigned as parent for the extracted chapters
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 */
export async function FetchChaptersSinglePageCSS(this: MangaScraper, manga: Manga, query: string = queryChapterListLinks, extractor = ChapterInfoExtractor): Promise<Chapter[]> {
    const request = new Request(new URL(manga.Identifier, this.URI), {
        method: 'POST',
        body: 'adult=true',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    const data = await FetchCSS<HTMLAnchorElement>(request, query);
    return data.map(element => {
        const { id, title } = extractor.call(this, element);
        return new Chapter(this, manga, id, title.replace(manga.Title, '').trim() || manga.Title);
    });
}

/**
 * A class decorator that adds the ability to extract all chapters for a given manga from this website using the given CSS {@link query}.
 * The chapters are extracted from the composed url based on the `Identifier` of the manga and the `URI` of the website.
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
 */
export function ChaptersSinglePageCSS(query: string = queryChapterListLinks, extractor = ChapterInfoExtractor) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersSinglePageCSS.call(this, manga, query, extractor);
            }
        };
    };
}

/**********************************************
 ******** Page List Extraction Methods ********
 **********************************************/

/**
 * An extension method for extracting all pages for the given {@link chapter} using the first match of the given regular expression {@link matchers}.
 * The pages are extracted from the composed url based on the `Identifier` of the {@link chapter} and the `URI` of the website.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param chapter - A reference to the {@link Chapter} which shall be assigned as parent for the extracted pages
 * @param matchers - An optional list of regular expressions (each must contain a capture group) used to find a JSON based list of image links within `<script>` tags,
 * only the first regular expression that matches will be used
 */
export async function FetchPagesSinglePageREGEX(this: MangaScraper, chapter: Chapter, ...matchers: RegExp[]): Promise<Page[]> {
    const request = new Request(new URL(chapter.Identifier, this.URI), {
        method: 'POST',
        body: 'adult=true',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    const response = await Fetch(request);
    const data = await response.text();

    for(const matcher of [...matchers, ...regexPageListEntries]) {
        const results = data.match(matcher);
        if(!results?.length) {
            continue;
        }
        let result = results[1];
        if(result.includes('atob')) {
            result = window.atob(result);
        }
        return JSON.parse(result).map((page: { url: string }) => {
            const link = new URL(page.url, request.url);
            return new Page(this, chapter, link);
        });
    }

    // TODO: throw error?
    return [];
}

/**
 * An extension method for extracting all pages for the given {@link chapter} using the first match of the given regular expression {@link matchers}.
 * The pages are extracted from the composed url based on the `Identifier` of the {@link chapter} and the `URI` of the website.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param chapter - A reference to the {@link Chapter} which shall be assigned as parent for the extracted pages
 * @param matchers - An optional list of regular expressions (each must contain a capture group) used to find a JSON based list of image links within `<script>` tags,
 * only the first regular expression that matches will be used
 */

/**
 * A class decorator that adds the ability to extract all pages for the given {@link chapter} using the first match of the given regular expression {@link matchers}.
 * The pages are extracted from the composed url based on the `Identifier` of the chapter and the `URI` of the website.
 * @param matchers - An optional list of regular expressions (each must contain a capture group) used to find a JSON based list of image links within `<script>` tags,
 * only the first regular expression that matches will be used
 */
export function PagesSinglePageREGEX(...matchers: RegExp[]) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesSinglePageREGEX.call(this, chapter, ...matchers);
            }
        };
    };
}

/***********************************************
 ******** Image Data Extraction Methods ********
 ***********************************************/