import { Exception } from '../../Error';
import { FetchJSON } from '../../platform/FetchProvider';
import { type MangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../../providers/MangaPlugin';
import type { Priority } from '../../taskpool/TaskPool';
import * as Common from './Common';
import { WebsiteResourceKey as R } from '../../../i18n/ILocale';

// TODO: Add Novel support

type APIMangaV1 = {
    title: string
    id: number,
    series_type: 'Comic' | 'Novel',
    series_slug: string,
    seasons?: APISeason[]
}

type APIResult<T> = {
    data: T
}

type APISeason = {
    index: number,
    chapters: APIChapter[]
}

type APIChapter = {
    index: string,
    id: number,
    chapter_name: string,
    chapter_title: string,
    chapter_slug: string,
}

type APIPages = {
    chapter_type: 'Comic' | 'Novel',
    paywall: boolean,
    data: string[] | string
    chapter: {
        chapter_type: 'Comic' | 'Novel',
        storage: string,
        chapter_data?: {
            images: string[]
        }

    }
}

type MangaOrChapterId = {
    id: string,
    slug: string
}

type PageType = {
    type: 'Comic' | 'Novel'
}

/***************************************************
 ******** Manga from URL Extraction Methods ********
 ***************************************************/

/**
 * An extension method for extracting a single manga from the given {@link url} using the HeanCMS api url {@link apiUrl}.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param provider - A reference to the {@link MangaPlugin} which shall be assigned as parent for the extracted manga
 * @param url - the manga url
 * @param apiUrl - The url of the HeanCMS api for the website
 */
export async function FetchMangaCSS(this: MangaScraper, provider: MangaPlugin, url: string, apiUrl: string): Promise<Manga> {
    const slug = new URL(url).pathname.split('/').at(-1);
    const { title, series_slug, id } = await FetchJSON<APIMangaV1>(new Request(new URL(`${apiUrl}/series/${slug}`)));
    return new Manga(this, provider, JSON.stringify({
        id: id.toString(),
        slug: series_slug
    }), title);
}

/**
 * An extension method for extracting a single manga from any url using the HeanCMS api url {@link apiUrl}.
 * @param pattern - An expression to check if a manga can be extracted from an url or not, it may contain the placeholders `{origin}` and `{hostname}` which will be replaced with the corresponding parameters based on the website's base URL
 * @param apiUrl - The url of the HeanCMS api for the website
 */
export function MangaCSS(pattern: RegExp, apiURL: string) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public ValidateMangaURL(this: MangaScraper, url: string): boolean {
                const source = pattern.source.replaceAll('{origin}', this.URI.origin).replaceAll('{hostname}', this.URI.hostname);
                return new RegExp(source, pattern.flags).test(url);
            }
            public async FetchManga(this: MangaScraper, provider: MangaPlugin, url: string): Promise<Manga> {
                return FetchMangaCSS.call(this, provider, url, apiURL);
            }
        };
    };
}

/***********************************************
 ******** Manga List Extraction Methods ********
 ***********************************************/

/**
 * An extension method for extracting multiple mangas using the HeanCMS api url {@link apiUrl}.
 * The range begins with 1 and is incremented until no more new mangas can be extracted.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param provider - A reference to the {@link MangaPlugin} which shall be assigned as parent for the extracted mangas
 * @param apiUrl - The url of the HeanCMS api for the website
 * @param throttle - A delay [ms] for each request (only required for rate-limited websites)
 */
export async function FetchMangasMultiPageAJAX(this: MangaScraper, provider: MangaPlugin, apiUrl: string, throttle = 0): Promise<Manga[]> {
    const mangaList: Manga[] = [];

    for (const adult of [true, false]) { //there is no "dont care if adult or not flag" on "new" api, and old dont care about the flag
        for (let page = 1, run = true; run; page++) {
            const mangas = await GetMangaFromPage.call(this, provider, page, apiUrl, adult);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
            await new Promise(resolve => setTimeout(resolve, throttle));
        }
    }
    return mangaList.distinct();//filter in case of old api
}
async function GetMangaFromPage(this: MangaScraper, provider: MangaPlugin, page: number, apiUrl: string, adult: boolean): Promise<Manga[]> {
    const request = new Request(new URL(`${apiUrl}/query?perPage=100&page=${page}&adult=${adult}`));
    const { data } = await FetchJSON<APIResult<APIMangaV1[]>>(request);
    return !data.length ? [] : data.map((manga) => new Manga(this, provider, JSON.stringify({ id: manga.id.toString(), slug: manga.series_slug }), manga.title));

}

/**
 * A class decorator that adds the ability to extract multiple mangas from a range of pages using the HeanCMS api url {@link apiUrl}.
 * @param apiUrl - The url of the HeanCMS api for the website
 * @param throttle - A delay [ms] for each request (only required for rate-limited websites)
 */
export function MangasMultiPageAJAX(apiUrl: string, throttle = 0) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchMangas(this: MangaScraper, provider: MangaPlugin): Promise<Manga[]> {
                return FetchMangasMultiPageAJAX.call(this, provider, apiUrl, throttle);
            }
        };
    };
}

/*************************************************
 ******** Chapter List Extraction Methods ********
 *************************************************/

/**
 * An extension method for extracting all chapters for the given {@link manga} using the HeanCMS api url {@link apiUrl}.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param manga - A reference to the {@link Manga} which shall be assigned as parent for the extracted chapters
 * @param apiUrl - The url of the HeanCMS api for the website
 */
export async function FetchChaptersSinglePageAJAXv1(this: MangaScraper, manga: Manga, apiUrl: string): Promise<Chapter[]> {
    try {
        const mangaslug = (JSON.parse(manga.Identifier) as MangaOrChapterId).slug;
        const request = new Request(new URL(`${apiUrl}/series/${mangaslug}`));
        const { seasons } = await FetchJSON<APIMangaV1>(request);
        return seasons.reduce(async (accumulator: Promise<Chapter[]>, season) => {
            const chapters = season.chapters.map(chapter => {
                const id = JSON.stringify({
                    id: chapter.id.toString(),
                    slug: chapter.chapter_slug
                });
                const title = `${seasons.length > 1 ? 'S' + season.index : ''} ${chapter.chapter_name} ${chapter.chapter_title || ''}`.trim();
                return new Chapter(this, manga, id, title);
            });
            (await accumulator).concat(...chapters);
            return accumulator;
        }, Promise.resolve<Chapter[]>([]));

    } catch {
        return [];
    }
}

/**
 * A class decorator that adds the ability to extract all chapters for a given manga from this website using the HeanCMS api url {@link apiUrl}.
 * @param apiUrl - The url of the HeanCMS api for the website
 */
export function ChaptersSinglePageAJAXv1(apiUrl: string) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersSinglePageAJAXv1.call(this, manga, apiUrl);
            }
        };
    };
}

/**
 * An extension method for extracting all chapters for the given {@link manga} using the HeanCMS api url {@link apiUrl}.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param manga - A reference to the {@link Manga} which shall be assigned as parent for the extracted chapters
 * @param apiUrl - The url of the HeanCMS api for the website
 */
export async function FetchChaptersSinglePageAJAXv2(this: MangaScraper, manga: Manga, apiUrl: string): Promise<Chapter[]> {
    const mangaid: MangaOrChapterId = JSON.parse(manga.Identifier);
    const { data } = await FetchJSON<APIResult<APIChapter[]>>(new Request(new URL(`${apiUrl}/chapter/query?series_id=${mangaid.id}&perPage=9999&page=1`)));
    return data.map(chapter => new Chapter(this, manga, JSON.stringify({
        id: chapter.id.toString(),
        slug: chapter.chapter_slug,
    }), `${chapter.chapter_name} ${chapter.chapter_title || ''}`.trim()));

}

/**
 * A class decorator that adds the ability to extract all chapters for a given manga from this website using the HeanCMS api url {@link apiUrl}.
 * @param apiUrl - The url of the HeanCMS api for the website
 */
export function ChaptersSinglePageAJAXv2(apiUrl: string) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersSinglePageAJAXv2.call(this, manga, apiUrl);
            }
        };
    };
}

/**********************************************
 ******** Page List Extraction Methods ********
 **********************************************/
/**
 * An extension method for extracting all pages for the given {@link chapter} using the HeanCMS api url {@link apiUrl}.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param chapter - A reference to the {@link Chapter} which shall be assigned as parent for the extracted pages
 * @param apiUrl - The url of the HeanCMS api for the website
 */
export async function FetchPagesSinglePageAJAX(this: MangaScraper, chapter: Chapter, apiUrl: string): Promise<Page<PageType>[]> {
    const chapterid: MangaOrChapterId = JSON.parse(chapter.Identifier);
    const mangaid: MangaOrChapterId = JSON.parse(chapter.Parent.Identifier);
    const data = await FetchJSON<APIPages>(new Request(new URL(`${apiUrl}/chapter/${mangaid.slug}/${chapterid.slug}`)));

    if (data.paywall) {
        throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
    }

    if (data.chapter.chapter_type.toLowerCase() === 'novel') {
        throw new Exception(R.Plugin_HeanCMS_ErrorNovelsNotSupported);
    }

    const listImages = data.data && Array.isArray(data.data) ? data.data as string[] : data.chapter.chapter_data.images;
    return listImages.map(image => new Page<PageType>(this, chapter, ComputePageUrl(image, data.chapter.storage, apiUrl), { type: data.chapter.chapter_type }));
}

/**
 * A class decorator that adds the ability to extract all pages for a given chapter using the HeanCMS api url {@link apiUrl}.
 * @param apiUrl - The url of the HeanCMS api for the website
 */
export function PagesSinglePageAJAX(apiUrl: string) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page<PageType>[]> {
                return FetchPagesSinglePageAJAX.call(this, chapter, apiUrl);
            }
        };
    };
}

/***********************************************
 ******** Image Data Extraction Methods ********
 ***********************************************/

/**
 * An extension method to get the image data for the given {@link page} according to an XHR based-approach.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param page - A reference to the {@link Page} containing the necessary information to acquire the image data
 * @param priority - The importance level for ordering the request for the image data within the internal task pool
 * @param signal - An abort signal that can be used to cancel the request for the image data
 * @param detectMimeType - Force a fingerprint check of the image data to detect its mime-type (instead of relying on the Content-Type header)
 * @param deProxifyLink - Remove common image proxies (default false)
 */
export async function FetchImageAjax(this: MangaScraper, page: Page, priority: Priority, signal: AbortSignal, detectMimeType = false, deProxifyLink = true): Promise<Blob> {
    if (page.Parameters?.type === 'Comic') {
        return Common.FetchImageAjax.call(this, page, priority, signal, detectMimeType, deProxifyLink);
    } else throw new Exception(R.Plugin_HeanCMS_ErrorNovelsNotSupported);
}

/**
 * A class decorator that adds the ability to get the image data for a given page by loading the source asynchronous with the `Fetch API`.
 * @param detectMimeType - Force a fingerprint check of the image data to detect its mime-type (instead of relying on the Content-Type header)
 * @param deProxifyLink - Remove common image proxies (default false)
 */
export function ImageAjax(detectMimeType = false, deProxifyLink = true) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchImage(this: MangaScraper, page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
                return FetchImageAjax.call(this, page, priority, signal, detectMimeType, deProxifyLink);
            }
        };
    };
}
/**
 * Compute the image full URL for HeanHMS based websites
 * @param image - A string containing the full url ( for {@link storage} "s3") or the pathname ( for {@link storage} "local"))
 * @param storage - As string representing the type of storage used : "s3" or "local"
 * @param apiUrl - The url of the HeanCMS api for the website *
 */
function ComputePageUrl(image: string, storage: string, apiUrl: string): URL {
    switch (storage) {
        case "s3": return new URL(image);
        case "local": return new URL(`${apiUrl}/${image}`);
    }
}
