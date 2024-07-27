import { FetchJSON } from '../../platform/FetchProvider';
import { type MangaScraper, Manga, Chapter, Page, type MangaPlugin } from '../../providers/MangaPlugin';
import * as Common from './Common';

type APISingleManga = { title: string };

type APIManga = {
    [id: string]: {
        author: string,
        artist: string,
        slug: string,
        groups: string[],
    }
};

type APIChapters = {
    preferred_sort: string[],
    chapters: { [id: string]: APIChapter }
};

type APIChapter = {
    title: string,
    folder: string,
    volume: string,
    groups: { [id: string]: string[] }
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
    const uri = new URL('/api/series/' + slug, this.URI);
    const { title } = await FetchJSON<APISingleManga>(new Request(uri));
    return new Manga(this, provider, slug, title);
}

/**
 * A class decorator that adds the ability to extract a manga from any url that matches the given {@link pattern}.
 * The last part of the url will be used as an id to call the api and get the title
 * @param pattern - An expression to check if a manga can be extracted from an url or not, it may contain the placeholders `{origin}` and `{hostname}` which will be replaced with the corresponding parameters based on the website's base URL
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
    const data = await FetchJSON<APIManga>(new Request(new URL('/api/get_all_series', this.URI)));
    return Object.entries(data).map(([key, value]) => {
        return new Manga(this, provider, value.slug, key);
    });
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
    const data = await FetchJSON<APIChapters>(new Request(new URL('/api/series/' + manga.Identifier, this.URI)));
    return Object.entries(data.chapters).sort(([num1], [num2]) => parseFloat(num2) - parseFloat(num1)).map(([number, { title }]) => {
        return new Chapter(this, manga, number, `Chapter ${ number }${ title.length > 0 ? ' - ' + title : '' }`);
    });
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
    const { chapters, preferred_sort } = await FetchJSON<APIChapters>(new Request(new URL('/api/series/' + chapter.Parent.Identifier, this.URI)));
    const chap = chapters[chapter.Identifier];
    const groupname = preferred_sort.shift() || Object.keys(chap.groups).shift();
    return chap.groups[groupname].map(page => new Page(this, chapter, new URL(`/media/manga/${chapter.Parent.Identifier}/chapters/${chap.folder}/${groupname}/${page}`, this.URI)));
}