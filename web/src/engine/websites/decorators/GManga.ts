import { FetchRequest, FetchJSON, FetchCSS } from '../../FetchProvider';
import { type MangaScraper, Manga, Chapter, type MangaPlugin, Page } from '../../providers/MangaPlugin';
import type { Priority } from '../../taskpool/TaskPool';
import * as Common from './Common';

type APISingleManga = {
    mangaDataAction: {
        mangaData: {
            id:number,
            title: string
        }
    }
};

export type packedData = {
    cols: string[],
    isCompact: boolean,
    isObject: boolean,
    isArray: boolean,
    maxLevel: number,
    rows: packedData[] | APIData[]

}

export type APIData = {
    [id: string]: number | string | Array<number>[]
}

export type APIResult = {
    iv: boolean,
    data: string;
}

type APIMangas = {
    mangas: {
        id: number,
        title: string
    }[]
}

type APIChapters = {
    chapterizations: {
        id: number,
        volume: number,
        chapter: number,
        title: string
    }[],
    releases: {
        id : number,
        team_id: number,
        chapterization_id: number,
        teams: number[]
    }[],
    teams: {
        id: number
        name: string
    }[],

}

type APIPages = {
    globals: {
        pageUrl: string,
        wla: {
            configs: {
                http_media_server: string,
                media_server : string
            }
        }
    },
    readerDataAction: {
        readerData: {
            release: {
                pages: string[],
                webp_pages: string[],
                storage_key: string
            }
        }
    }
}

const mangasearch = {
    title: '',
    manga_types: {
        include: ['1', '2', '3', '4', '5', '6', '7', '8'],
        exclude: []
    },
    oneshot: { value: null },
    story_status: { include: [], exclude: [] },
    translation_status: { include: [], exclude: ['3'] },
    categories: { include: [], exclude: [] },
    chapters: { min: '', max: '' },
    dates: { start: null, end: null },
    page: 0
};

/***********************************************
 ******** Manga Extraction Methods ********
 ***********************************************/

/**
 * A class decorator that adds the ability to extract a manga from any {@link url}
 * The last part of the url will be used as an id to call the api and get the title
 */
async function FetchMangaCSS(this: MangaScraper, provider: MangaPlugin, url: string): Promise<Manga> {
    const request = new FetchRequest(url);
    const response = await FetchCSS(request, 'script[data-component-name="HomeApp"]');
    const data: APISingleManga = JSON.parse(response[0].textContent);
    const id = data.mangaDataAction.mangaData.id;
    const title = data.mangaDataAction.mangaData.title.trim(); // data.mangaDataAction.mangaData.arabic_title
    return new Manga(this, provider, String(id), title);
}

/**
 * A class decorator that adds the ability to extract a manga from any url that matches the given {@link pattern}.
 * The last part of the url will be used as an id to call the api and get the title
 * @param pattern - An expression to check if a manga can be extracted from an url or not
 */
export function MangaCSS(pattern: RegExp) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);

        return class extends ctor {
            public ValidateMangaURL(this: MangaScraper, url: string): boolean {
                const source = pattern.source.replaceAll('{origin}', this.URI.origin).replaceAll('{hostname}', this.URI.hostname);
                return new RegExp(source, pattern.flags).test(url);
            }
            public async FetchManga(this: MangaScraper, provider: MangaPlugin, url: string): Promise<Manga> {
                return FetchMangaCSS.call(this, provider, url);
            }
        };
    };
}

/***********************************************
 ******** Manga List Extraction Methods ********
 ***********************************************/

async function FetchMangasMultiPageAJAX(this: MangaScraper, provider: MangaPlugin, apiUrl : string): Promise<Manga[]> {
    const mangaList = [];
    for (let page = 1, run = true; run; page++) {
        const mangas = await getMangasFromPage(provider, page, apiUrl);
        mangas.length > 0 ? mangaList.push(...mangas) : run = false;
    }
    return mangaList;
}

async function getMangasFromPage(provider: MangaPlugin, page: number, apiUrl: string): Promise<Manga[]>
{
    mangasearch.page = page;
    const request = new FetchRequest(new URL('/api/mangas/search', apiUrl).href, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(mangasearch)
    });

    const response = await FetchJSON<APIResult>(request);
    const data = response.iv ? await decrypt(response.data) : response.data;
    const mangas: APIMangas = JSON.parse(data);
    return !mangas.mangas ? [] : mangas.mangas.map(manga => new Manga(this, provider, String(manga.id), manga.title));
}

/**
 * A class decorator that adds the ability to extract a manga list using the website api.
 */
export function MangasMultiPageAJAX(apiUrl : string) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchMangas(this: MangaScraper, provider: MangaPlugin): Promise<Manga[]> {
                return FetchMangasMultiPageAJAX.call(this, provider, apiUrl);
            }
        };
    };
}

/*************************************************
 ******** Chapter List Extraction Methods ********
 *************************************************/

async function FetchChapterSinglePageAJAX(this: MangaScraper, manga: Manga, apiUrl: string): Promise<Chapter[]> {
    const request = new FetchRequest(new URL(`/api/mangas/${manga.Identifier}/releases`, apiUrl).href);
    const response = await FetchJSON<APIResult>(request);
    const strdata = response.iv ? await decrypt(response.data) : JSON.stringify(response);
    const tmpdata: packedData | APIChapters = JSON.parse(strdata);
    const chapters: APIChapters = (tmpdata as packedData).isCompact ? _unpack(tmpdata as packedData) as APIChapters : tmpdata as APIChapters;
    return chapters.releases.map(chapter => {
        const team = chapters.teams.find(t => t.id === chapter.team_id);
        const chapterization = chapters.chapterizations.find(c => c.id === chapter.chapterization_id);
        let title = 'Vol.' + chapterization.volume + ' Ch.' + chapterization.chapter;
        title += chapterization.title ? ' - ' + chapterization.title : '';
        title += team.name ? ' [' + team.name + ']' : '';
        //url format is /manga/<mangaid>/anything/<chapternumber>/<chapter_release_id>
        const id = [manga.Identifier, manga.Title, chapterization.chapter, chapter.id].join('/');
        return new Chapter(this, manga, id, title);
    });
}

/**
 * A class decorator that adds the ability to extract chapter list from a manga using the website api.
 */

export function ChaptersSinglePageAJAX(apiUrl : string) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);

        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChapterSinglePageAJAX.call(this, manga, apiUrl);
            }
        };
    };
}

/*************************************************
 ******** Pages Extraction Methods ********
 *************************************************/

/**
 * A class decorator that adds the ability to extract pages list from a chapter
 */
export function PagesSinglePageCSS() {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);

        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesSinglePageCSS.call(this, chapter);
            }
        };
    };
}

async function FetchPagesSinglePageCSS(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
    const request = new FetchRequest(new URL(`/mangas/${chapter.Identifier}`, this.URI).href);
    const response = await FetchCSS(request, 'script[data-component-name="HomeApp"]');
    const data: APIPages = JSON.parse(response[0].textContent);

    const url = (data.globals.wla.configs.http_media_server || data.globals.wla.configs.media_server) + '/uploads/releases/';
    let images: string[] = [];
    if (data.readerDataAction.readerData.release.pages && data.readerDataAction.readerData.release.pages.length > 0) {
        images = data.readerDataAction.readerData.release.pages.map(page => '/hq/' + page);
    } else {
        images = data.readerDataAction.readerData.release.webp_pages.map(page => '/hq_webp/' + page);
    }
    return images.map(image => {
        const uri = new URL(url, request.url);
        uri.pathname += data.readerDataAction.readerData.release.storage_key + image;
        return new Page(this, chapter, uri);
    });

}

/***********************************************
 ******** Image Data Extraction Methods ********
 ***********************************************/

/**
 * An extension method to get the image data for the given {@link page}.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param page - A reference to the {@link Page} containing the necessary information to acquire the image data
 * @param priority - The importance level for ordering the request for the image data within the internal task pool
 * @param signal - An abort signal that can be used to cancel the request for the image data
 * @param detectMimeType - Force a fingerprint check of the image data to detect its mime-type (instead of relying on the Content-Type header)
 */
async function FetchImageAjax(this: MangaScraper, page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
    let data = await Common.FetchImageAjax.call(this, page, priority, signal);
    if (data.type === 'text/html') {
        const newUrl = new URL(page.Link.href.replace('/hq', '/mq'));
        page.Link.href = newUrl.href;
        data = await Common.FetchImageAjax.call(this, page, priority, signal);
    }
    return data;
}

/**
 * A class decorator that adds the ability to get the image data for a given page by loading the source asynchronous with the `Fetch API`.
 */
export function ImageAjax() {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        Common.ThrowOnUnsupportedDecoratorContext(context);

        return class extends ctor {
            public async FetchImage(this: MangaScraper, page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
                return FetchImageAjax.call(this, page, priority, signal);
            }
        };
    };
}

export async function decrypt(t: string) : Promise<string>{
    const e = t.split("|");
    const n = e[0];
    const r = e[2];
    const o = e[3];
    const hash = await crypto.subtle.digest('SHA-256', Buffer.from(o));
    const i = Buffer.from(hash).toString('hex');//c.default.SHA256(o).toString();

    const plaintext = Buffer.from(n, 'base64');
    const key = Buffer.from(i, 'hex');
    const iv = Buffer.from(r, 'base64');

    const secretKey = await crypto.subtle.importKey(
        'raw',
        key,
        {
            name: 'AES-CBC',
            length: 128
        }, true, ['encrypt', 'decrypt']);

    const decrypted = await crypto.subtle.decrypt({
        name: 'AES-CBC',
        iv: iv
    }, secretKey, plaintext);

    return new TextDecoder('utf-8').decode(decrypted);
}

export function _unpack(t: packedData | APIData, ...args) {
    const e = arguments.length > 1 && void 0 !== args[1] ? args[1] : 1;
    if (!t || e > t.maxLevel)
        return t;
    if ( typeof t != 'object' || !t.isCompact)
        return t;
    const n = (t as packedData).cols;
    const r = (t as packedData).rows;
    if (t.isObject) {
        const o = {};
        let i = 0;
        return n.forEach(function (t) {
            o[t] = _unpack(r[i], e + 1);
            i += 1;
        }.bind(this)),
        o;
    }
    if (t.isArray) {
        const o = [];
        return r.forEach(function (t) {
            const e = {};
            let r = 0;
            n.forEach(function (n) {
                e[n] = t[r];
                r += 1;
            }),
            o.push(e);
        }),
        o;
    }
}