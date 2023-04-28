import { FetchRequest, FetchJSON } from '../../FetchProvider';
import { type MangaScraper, Manga, Chapter, Page, type MangaPlugin } from '../../providers/MangaPlugin';
import type * as Common from './Common';

type APIManga = { title: string };

type APIChapters = {
    preferred_sort : string[],
    chapters: {
        title: string,
        folder: string,
    }[]
};

/***********************************************
 ******** Manga Extraction Methods ********
 ***********************************************/

/**
 * A class decorator that adds the ability to extract a manga from any {@link url}
 * The last part of the url will be used as an id to call the api and get the title
 */
async function FetchMangaAJAX(this: MangaScraper, provider: MangaPlugin, url: string): Promise<Manga> {
    const slug = new URL(url).pathname.match(/([^/]*)\/*$/)[1];
    const uri = new URL('/api/series/' + slug, this.URI);
    const request = new FetchRequest(uri.href);
    const { title } = await FetchJSON<APIManga>(request);
    return new Manga(this, provider, slug, title);
}

/**
 * A class decorator that adds the ability to extract a manga from any url that matches the given {@link pattern}.
 * The last part of the url will be used as an id to call the api and get the title
 * @param pattern - An expression to check if a manga can be extracted from an url or not
 */
export function MangaAJAX(pattern: RegExp) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T): T {
        return class extends ctor {
            public ValidateMangaURL(this: MangaScraper, url: string): boolean {
                return pattern.test(url);
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
    const uri = new URL('/api/get_all_series', this.URI);
    const request = new FetchRequest(uri.href);
    const data = await FetchJSON(request);
    return Object.entries(data).map(([key, value]) => {
        return new Manga(this, provider, value.slug, key);
    });
}

/**
 * A class decorator that adds the ability to extract a manga list using the website api.
 */
export function MangasSinglePageAJAX() {
    return function DecorateClass<T extends Common.Constructor>(ctor: T): T {
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
    const uri = new URL('/api/series/' + manga.Identifier, this.URI);
    const request = new FetchRequest(uri.href);
    const data = await FetchJSON<APIChapters>(request);
    return Object.entries(data.chapters).sort(([num1], [num2]) => parseFloat(num2) - parseFloat(num1)).map(([number, { title }]) => {
        return new Chapter(this, manga, number, `Chapter ${ number }${ title.length > 0 ? ' - ' + title : '' }`);
    });
}
/**
 * A class decorator that adds the ability to extract chapter list from a manga using the website api.
 */
export function ChaptersSinglePageAJAX() {
    return function DecorateClass<T extends Common.Constructor>(ctor: T): T {
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
    return function DecorateClass<T extends Common.Constructor>(ctor: T): T {
        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesSinglePageAJAX.call(this, chapter);
            }
        };
    };
}

async function FetchPagesSinglePageAJAX(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
    const uri = new URL('/api/series/' + chapter.Parent.Identifier, this.URI);
    const request = new FetchRequest(uri.href);
    const data = await FetchJSON <APIChapters>(request);
    const [pages, group] = getPagesInfo(data, chapter);
    return pages.map(page => new Page(this, chapter, new URL(`${this.URI}/media/manga/${chapter.Parent.Identifier}/chapters/${data.chapters[chapter.Identifier].folder}/${group}/${page}`)));
}

function getPagesInfo(data: APIChapters, chapter : Chapter) {
    const groups = data.chapters[chapter.Identifier].groups;
    const group = data.preferred_sort.shift() || Object.keys(groups).shift();
    return [groups[group], group];
}
