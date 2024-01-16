// https://github.com/FedericoHeichou/PizzaReader

import { FetchJSON } from '../../platform/FetchProvider';
import { type MangaScraper, Manga, Chapter, Page, type MangaPlugin } from '../../providers/MangaPlugin';
import * as Common from './Common';

type APISingleManga = {
    comic: APIManga
};

type APIMangas = {
    comics: APIManga[]
};

type APIPages = {
    chapter : APIChapter
}

type APIManga = {
    title: string,
    slug: string,
    url: string,
    chapters: APIChapter[]
}

type APIChapter = {
    full_title: string,
    title: string,
    url: string,
    language: string,
    pages : string[]
}

/***********************************************
 ******** Manga Extraction Methods ********
 ***********************************************/

/**
 * A class decorator that adds the ability to extract a manga from any {@link url}
 * The last part of the url will be used as an id to call the api and get the title
 */
async function FetchMangaAJAX(this: MangaScraper, provider: MangaPlugin, url: string): Promise<Manga> {
    const slug = new URL(url).pathname.match(/([^/]*)\/*$/)[1];
    const uri = new URL(`/api/comics/${slug}`, this.URI);
    const request = new Request(uri.href);
    const data = await FetchJSON<APISingleManga>(request);
    return new Manga(this, provider, slug, data.comic.title);
}

/**
 * A class decorator that adds the ability to extract a manga from any url that matches the given {@link pattern}.
 * The last part of the url will be used as an id to call the api and get the title
 * @param pattern - An expression to check if a manga can be extracted from an url or not
 */
export function MangaAJAX(pattern: RegExp) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);

        return class extends ctor {
            public ValidateMangaURL(this: MangaScraper, url: string): boolean {
                const source = pattern.source.replaceAll('{origin}', this.URI.origin).replaceAll('{hostname}', this.URI.hostname);
                return new RegExp(source, pattern.flags).test(url);
            }
            public async FetchManga(this: MangaScraper, provider: MangaPlugin, url: string): Promise<Manga> {
                return FetchMangaAJAX.call(this, provider, url);
            }
        };
    };
}
/***********************************************
******** Manga List Extraction Methods ********
***********************************************/
async function FetchMangasSinglePageAJAX(this: MangaScraper, provider: MangaPlugin): Promise<Manga[]> {
    const uri = new URL('/api/comics', this.URI);
    const request = new Request(uri.href);
    const data = await FetchJSON<APIMangas>(request);
    return data.comics.map(manga => new Manga(this, provider, manga.slug, manga.title));
}

/**
 * A class decorator that adds the ability to extract a manga list using the website api.
 */
export function MangasSinglePageAJAX() {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);

        return class extends ctor {
            public async FetchMangas(this: MangaScraper, provider: MangaPlugin): Promise<Manga[]> {
                return FetchMangasSinglePageAJAX.call(this, provider);
            }
        };
    };
}

/*************************************************
 ******** Chapter List Extraction Methods ********
 *************************************************/

async function FetchChapterSinglePageAJAX(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
    const uri = new URL(`/api/comics/${manga.Identifier}`, this.URI);
    const request = new Request(uri.href);
    const data = await FetchJSON<APISingleManga>(request);
    return data.comic.chapters.map(chapter => new Chapter(this, manga, chapter.url, chapter.full_title));
}

/**
 * A class decorator that adds the ability to extract chapter list from a manga using the website api.
 */
export function ChaptersSinglePageAJAX() {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);

        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChapterSinglePageAJAX.call(this, manga);
            }
        };
    };
}

/*************************************************
 ******** Pages Extraction Methods ********
 *************************************************/

/**
 * A class decorator that adds the ability to extract pages list from a chapter using the website api.
 */
export function PagesSinglePageAJAX() {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);

        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesSinglePageAJAX.call(this, chapter);
            }
        };
    };
}

async function FetchPagesSinglePageAJAX(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
    const uri = new URL(`/api${chapter.Identifier}`, this.URI); //chapter.Identifier is a pathname i.e /read/xxx/xxx/xxx, no need to add a '/'
    const request = new Request(uri.href);
    const data = await FetchJSON<APIPages>(request);
    return data.chapter.pages.map(page => new Page(this, chapter, new URL(page)));
}