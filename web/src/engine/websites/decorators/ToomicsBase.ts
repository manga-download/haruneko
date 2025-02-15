import { FetchCSS } from "../../platform/FetchProvider";
import { type MangaScraper, type MangaPlugin, Manga, Chapter } from '../../providers/MangaPlugin';
import * as Common from "./Common";

export const queryPages = '#viewer-img img';

const defaultMangaPath = '/{language}/webtoon/ranking';

function MangaInfoExtractor(appendLanguage : boolean = true) {
    return function (this: MangaScraper, element: HTMLAnchorElement, addLanguage: boolean = appendLanguage) {
        const language = element.pathname.match(/^\/([a-z]{2,3})\//)[1];
        const title = (element.querySelector('h4.title, h4') ?? element).textContent.trim();
        return {
            id: element.pathname,
            title: addLanguage ? [title, `[${language}]`].join(' ').trim() : title
        };
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
 * @param appendLanguage - Add language to manga title or not
  */
export async function FetchMangaCSS(this: MangaScraper, provider: MangaPlugin, url: string, query: string, appendLanguage: boolean = true): Promise<Manga> {
    const lang = new URL(url).pathname.match(/\/([a-z]{2,3})\//)[1];
    const [mangatitle] = await FetchCSS(new Request(url), query);
    const title = mangatitle instanceof HTMLTitleElement ? mangatitle.textContent.split(' - ').at(0).trim() : mangatitle.textContent.trim();
    return new Manga(this, provider, new URL(url).pathname, appendLanguage ? [title, `[${lang}]`].join(' ').trim(): title.trim());
}

/**
 * A class decorator that adds the ability to extract a manga using the given CSS {@link query} from any url that matches the given {@link pattern}.
 * The `pathname` of the url will be used as identifier for the extracted manga.
 * When the CSS {@link query} matches a `meta` element, the manga title will be extracted from its `content` attribute, otherwise the `textContent` of the element will be used as manga title.
 * @param pattern - An expression to check if a manga can be extracted from an url or not, it may contain the placeholders `{origin}` and `{hostname}` which will be replaced with the corresponding parameters based on the website's base URL
 * @param query - A CSS query to locate the element from which the manga title shall be extracted
 * @param appendLanguage - Add language to manga title or not
 */
export function MangaCSS(pattern: RegExp, query: string, appendLanguage : boolean = true) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public ValidateMangaURL(this: MangaScraper, url: string): boolean {
                const source = pattern.source.replaceAll('{origin}', this.URI.origin).replaceAll('{hostname}', this.URI.hostname);
                return new RegExp(source, pattern.flags).test(url);
            }
            public async FetchManga(this: MangaScraper, provider: MangaPlugin, url: string): Promise<Manga> {
                return FetchMangaCSS.call(this, provider, url, query, appendLanguage);
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
 * @param path - The path of the page to extract manga. Placeholder `{language}` will be replaced with each {@link languages} specified
 * @param appendLanguage - Add language to manga title or not
  */
export async function FetchMangasSinglePageCSS(this: MangaScraper, provider: MangaPlugin, languages: string[], query, path: string = defaultMangaPath, appendLanguage: boolean = true): Promise<Manga[]> {
    const mangalist: Manga[] = [];
    for (const language of languages) {
        const mangas = await Common.FetchMangasSinglePagesCSS.call(this, provider, [path.replace('{language}', language)], query, MangaInfoExtractor(appendLanguage)) ;
        mangalist.push(...mangas);
    }
    return mangalist.distinct();
}

/**
 * A class decorator that adds the ability to extract multiple mangas from the given relative {@link path} using the given CSS {@link query}.
 * @param path - The path relative to the scraper's base url from which the mangas shall be extracted
 * @param query - A CSS query to locate the elements from which the manga identifier and title shall be extracted
 * @param languages - A array of langage code used by the website :['fr', 'de'....]
 * @param path - The path of the page to extract manga. Placeholder `{language}` will be replaced with each {@link languages} specified
 * @param appendLanguage - Add language to manga title or not
  */
export function MangasSinglePageCSS(languages: string[], query: string, path: string = defaultMangaPath, appendLanguage: boolean = true) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchMangas(this: MangaScraper, provider: MangaPlugin): Promise<Manga[]> {
                return FetchMangasSinglePageCSS.call(this, provider, languages, query, path, appendLanguage);
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
export async function FetchChaptersSinglePageCSS(this: MangaScraper, manga: Manga, query: string): Promise<Chapter[]> {
    const chapterRegexp = /\/[a-z]{2,3}\/webtoon\/detail\/code\/\d+\/ep\/\d+\/toon\/\d+/;
    const lang = manga.Identifier.match(/^\/([a-z]{2,3})\//).at(1);
    const mangaTitle = manga.Title.replace(/\[.+\]$/, '').trim();

    const nodes = await FetchCSS<HTMLAnchorElement>(new Request(new URL(manga.Identifier, this.URI)), query);
    return nodes.map(element => {
        const action = element.getAttribute('onclick');
        let chapterId = element.pathname;
        if (chapterRegexp.test(action)) {
            chapterId = action.match(chapterRegexp).at(0);
        } else if (!chapterRegexp.test(chapterId)) {
            chapterId = `/${lang}/webtoon/detail/code/${window.atob(element.dataset.c)}/ep/${window.atob(element.dataset.v)}/toon/${window.atob(element.dataset.e)}`;
        }
        const title = [element.querySelector('div.ep__name, div.cell-title').textContent.replace(mangaTitle, '').trim(), window.atob(element.dataset.v)].join(' ').trim();
        return new Chapter(this, manga, chapterId, title);

    });
}

/**
 * A class decorator that adds the ability to extract all chapters for a given manga from this website using the given CSS {@link query}.
 * The chapters are extracted from the composed url based on the `Identifier` of the manga and the `URI` of the website.
 * @param query - A CSS query to locate the elements from which the chapter identifier and title shall be extracted
s*/
export function ChaptersSinglePageCSS(query: string) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersSinglePageCSS.call(this, manga, query);
            }
        };
    };
}
