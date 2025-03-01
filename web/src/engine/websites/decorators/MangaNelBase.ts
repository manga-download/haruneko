import { FetchCSS } from '../../platform/FetchProvider';
import { type MangaScraper, type MangaPlugin, Manga } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';

const queryMangaTitle = 'div.story-info-right h1, ul.manga-info-text li h1';
export const queryChapters = 'div.chapter-list div.row span a, ul.row-content-chapter li a.chapter-name';
export const queryPages = 'div.container-chapter-reader > img';
export function AnchorInfoExtractor(this: MangaScraper, element: HTMLAnchorElement) {
    return {
        id: element.origin === this.URI.origin ? element.pathname : element.href,
        title: element.text.trim()
    };
}

/***************************************************
 ******** Manga from URL Extraction Methods ********
 ***************************************************/

// TODO?: Apply this.mangaTitleFilter = /(\s+manga|\s+webtoon|\s+others)+\s*$/gi;
// TODO?: Apply this.cfMailDecrypt(element);

/**
 * An extension method for extracting a single manga from the given {@link url} using the given CSS {@link query}.
 * For same-site references the `pathname` of the given {@link url} will be used as identifier for the extracted manga, for cross-site references the `href` will be used.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param provider - A reference to the {@link MangaPlugin} which shall be assigned as parent for the extracted manga
 * @param url - The url from which the manga shall be extracted
 * @param query - A CSS query to locate the element from which the manga title shall be extracted
 */
export async function FetchMangaCSS(this: MangaScraper, provider: MangaPlugin, url: string, query: string = queryMangaTitle): Promise<Manga> {
    const uri = new URL(url);
    const element = (await FetchCSS<HTMLElement>(new Request(uri), query)).at(0);
    return new Manga(this, provider, uri.origin === this.URI.origin ? uri.pathname : uri.href, element.textContent.trim());
}

/**
 * A class decorator that adds the ability to extract a manga using the given CSS {@link query} from any url that matches the given {@link pattern}.
 * For same-site references the `pathname` of the given {@link url} will be used as identifier for the extracted manga, for cross-site references the `href` will be used.
 * @param pattern - An expression to check if a manga can be extracted from an url or not, it may contain the placeholders `{origin}` and `{hostname}` which will be replaced with the corresponding parameters based on the website's base URL
 * @param query - A CSS query to locate the element from which the manga title shall be extracted
 */
export function MangaCSS(pattern: RegExp, query: string = queryMangaTitle) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public ValidateMangaURL(this: MangaScraper, url: string): boolean {
                const source = pattern.source.replaceAll('{origin}', this.URI.origin).replaceAll('{hostname}', this.URI.hostname);
                return new RegExpSafe(source, pattern.flags).test(url);
            }
            public async FetchManga(this: MangaScraper, provider: MangaPlugin, url: string): Promise<Manga> {
                return FetchMangaCSS.call(this, provider, url, query);
            }
        };
    };
}