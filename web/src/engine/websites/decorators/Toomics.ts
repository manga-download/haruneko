import { FetchCSS } from "../../platform/FetchProvider";
import { type MangaScraper, type MangaPlugin, Manga, Chapter } from '../../providers/MangaPlugin';
import * as Common from "./Common";

//CSS for CopyPaste
export const queryMangaTitleUri = [
    'section.ep-header_ch div.title_content h1', //Toomics
    '#episode_title', //LalaToon
].join(',');

//CSS for manga list
export const queryMangas = [
    'div.sub__list ul li > a', //lalatoon
    'div.section_ongoing div.list_wrap ul li > div.visual > a'//Toomics
].join(',');

export const queryMangaTitle = [
    'h4.thumb__title', //lalatoon
    'h4.title'//Toomics
].join(',');

export const queryChapter = [
    'ul.ep__list li a', //lalatoon
    'ol.list-ep li a'// Toomics
].join(',');

export const queryChapterNum = [
    'div.cell-num', //Toomics
    'div.ep__turning, div.ep__turning-txt', //Lalatoon
    'div.ep__episode' // ToomicsKO
].join(',');

export const queryChapterTitle = [
    'div.cell-title strong', //Toomics, HotComics
    'div.ep__name', //Lalatoon
    'strong.ep__title'//ToomicsKO
].join(',');

export const queryPages = '#viewer-img img';

const defaultMangaPath = '/webtoon/ranking';

function MangaInfoExtractor(element: HTMLAnchorElement) {
    const language = element.pathname.match(/\/([a-z]+)\//)[1];
    return {
        id: element.pathname,
        title: [element.querySelector(queryMangaTitle).textContent.trim(), `[${language}]`].join(' ').trim()
    };
}

function ChapterExtractor(element: HTMLAnchorElement) {
    const action = element.getAttribute('onclick');

    if (action) {
        if (action.includes('location.href=')) {
            element.href = action.match(/href='([^']+)'/)[1];
        } else if (action.includes('showMandatoryShare')) {
            element.href = action.match(/showMandatoryShare\s*\(\s*'([^']+)'/)[1];
        } else if (action.includes('collectEpisodeModal')) {
            element.href = action.match(/collectEpisodeModal\s*\(\s*'\d+'\s*,\s*'\d+'\s*,\s*'([^']+)'/)[1];
        } else {
            element.href = action.match(/popup\s*\(\s*'[^']+'\s*,\s*'[^']*'\s*,\s*'([^']+)'/)[1];
        }
    }

    const chapterNumber = element.querySelector(queryChapterNum)?.textContent.trim();
    const subtitle = element.querySelector(queryChapterTitle)?.textContent.trim();
    return {
        id: element.pathname,
        title: [chapterNumber, subtitle].join(' ').trim()
    };
}

export function PageExtractor(element: HTMLImageElement) {
    return element.dataset.original || element.dataset.src || element.getAttribute('src') || '';
}

/***************************************************
 ******** Manga from URL Extraction Methods ********
 ***************************************************/

/**
 * An extension method for extracting a single manga from the given {@link url} using the given CSS {@link query}.
 * The `pathname`and the `search` of the given {@link url} will be used as identifier for the extracted manga.
 * When the CSS {@link query} matches a `meta` element, the manga title will be extracted from its `content` attribute, otherwise the `textContent` of the element will be used as manga title.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param provider - A reference to the {@link MangaPlugin} which shall be assigned as parent for the extracted manga
 * @param url - The url from which the manga shall be extracted
 * @param query - the CSS selector to get manga title
 */
export async function FetchMangaCSS(this: MangaScraper, provider: MangaPlugin, url: string, query: string = queryMangaTitleUri): Promise<Manga> {
    const lang = new URL(url).pathname.match(/\/([a-z]+)\//)[1];
    const [mangatitle] = await FetchCSS(new Request(url), query);
    return new Manga(this, provider, new URL(url).pathname, [mangatitle.textContent.trim(), `[${lang}]`].join(' ').trim());
}

/**
 * A class decorator that adds the ability to extract a manga using the given CSS {@link query} from any url that matches the given {@link pattern}.
 * The `pathname` of the url will be used as identifier for the extracted manga.
 * When the CSS {@link query} matches a `meta` element, the manga title will be extracted from its `content` attribute, otherwise the `textContent` of the element will be used as manga title.
 * @param pattern - An expression to check if a manga can be extracted from an url or not, it may contain the placeholders `{origin}` and `{hostname}` which will be replaced with the corresponding parameters based on the website's base URL
 * @param query - A CSS query to locate the element from which the manga title shall be extracted
 */
export function MangaCSS(pattern: RegExp, query: string = queryMangaTitleUri) {
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
 * An extension method for extracting multiple mangas from the given relative {@link path} using the given CSS {@link query}.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param provider - A reference to the {@link MangaPlugin} which shall be assigned as parent for the extracted mangas
 * @param languages - A array of langage code used by the website :['fr', 'de'....]
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 * @param defaultMangaPath - path to append to language string
 * @param extract - A function to extract the manga identifier and title from a single element (found with {@link query})
 */
export async function FetchMangasSinglePageCSS(this: MangaScraper, provider: MangaPlugin, languages: string[], query = queryMangas, subpath = defaultMangaPath, extract = MangaInfoExtractor): Promise<Manga[]> {
    const mangalist: Manga[] = [];
    for (const language of languages) {
        const mangas = await Common.FetchMangasSinglePagesCSS.call(this, provider, [`/${language}${subpath}`], query, extract);
        mangalist.push(...mangas);
    }
    return mangalist.distinct();
}

/**
 * A class decorator that adds the ability to extract multiple mangas from the given relative {@link path} using the given CSS {@link query}.
 * @param path - The path relative to the scraper's base url from which the mangas shall be extracted
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 * @param languages - A array of langage code used by the website :['fr', 'de'....]
 * @param extract - A function to extract the manga identifier and title from a single element (found with {@link query})
 * @param defaultMangaPath - path to append to language string
 */
export function MangasSinglePageCSS(languages: string[], query = queryMangas, subpath = defaultMangaPath, extract = MangaInfoExtractor) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchMangas(this: MangaScraper, provider: MangaPlugin): Promise<Manga[]> {
                return FetchMangasSinglePageCSS.call(this, provider, languages, query, subpath, extract);
            }
        };
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
 */
export async function FetchChaptersSinglePageCSS(this: MangaScraper, manga: Manga, query: string = queryChapter): Promise<Chapter[]> {
    let chapters = await Common.FetchChaptersSinglePageCSS.call(this, manga, query, ChapterExtractor);
    if (chapters.length === 0) chapters = await Common.FetchChaptersSinglePageCSS.call(this, manga, query, ChapterExtractor); //yes, Toomics redirect first request to FIRST CHAPTER..
    const mangatitle = manga.Title.replace(/\[.+\]$/, '').trim();
    return chapters.map(chapter => new Chapter(this, manga, chapter.Identifier, chapter.Title.replace(mangatitle, '').trim()));
}

/**
 * A class decorator that adds the ability to extract all chapters for a given manga from this website using the given CSS {@link query}.
 * The chapters are extracted from the composed url based on the `Identifier` of the manga and the `URI` of the website.
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
s*/
export function ChaptersSinglePageCSS(query: string = queryChapter) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersSinglePageCSS.call(this, manga, query);
            }
        };
    };
}
