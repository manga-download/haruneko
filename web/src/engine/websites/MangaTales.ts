import { Tags } from '../Tags';
import icon from './MangaTales.webp';
import { Chapter, DecoratableMangaScraper, Page, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';
import * as Common from './decorators/Common';
import type { Priority } from '../taskpool/DeferredTask';

type APIResult = {
    iv: boolean,
    data: string;
}

type TMangaSearch = {
    title: string,
    manga_types: {
        include: string[],
        exclude: string[]
    },
    oneshot: {
        value: null
    },
    story_status: {
        include: string[],
        exclude: string[]
    },
    translation_status: {
        include: string[],
        exclude: string[]
    },
    categories: {
        include: string[],
        exclude: string[]
    },
    chapters: {
        min: string,
        max: string
    },
    dates: {
        start: null,
        end: null
    },
    page: number
}

type APIData = {
    [id: string]: number | string | Array<number>[]
}

type PackedData = {
    cols: string[],
    isCompact: boolean,
    isObject: boolean,
    isArray: boolean,
    maxLevel: number,
    rows: PackedData[] | APIData[]

}

type APISingleManga = {
    mangaDataAction: {
        mangaData: {
            id: number,
            title: string
        }
    }
};

type APIMangas = {
    mangas: {
        id: number,
        title: string
    }[]
}

type APIChapters = {
    mangaReleases: {
        team_id: number,
        teams: {
            id: number,
            name: string
        }[],
        volume: number,
        title: string,
        chapter: number
    }[]
}

type APIPages = {
    globals: {
        pageUrl: string,
        wla: {
            configs: {
                http_media_server: string,
                media_server: string
            }
        }
    },
    readerDataAction: {
        readerData: {
            release: {
                hq_pages: string,
                mq_pages: string,
                lq_pages: string
            }
        }
    }
}
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://mangatales.com/api/mangas/';
    public constructor() {
        super('mangatales', `MangaTales`, 'https://mangatales.com', Tags.Language.Arabic, Tags.Media.Manga, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/mangas/\\d+/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const response = await FetchCSS(new Request(url), 'script[data-component-name="HomeApp"]');
        const data: APISingleManga = JSON.parse(response[0].textContent);
        return new Manga(this, provider, data.mangaDataAction.mangaData.id.toString(), data.mangaDataAction.mangaData.title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const searchBody: TMangaSearch = {
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
        const mangaList : Manga[]= [];
        for (let page = 1, run = true; run; page++) {
            searchBody.page = page;
            const mangas = await this.GetMangasFromPage(provider, searchBody, this.apiUrl);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    async GetMangasFromPage(provider: MangaPlugin, searchBody: TMangaSearch, apiUrl: string): Promise<Manga[]> {
        const request = new Request(new URL('search', apiUrl), {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(searchBody)
        });

        const response = await FetchJSON<APIResult>(request);
        const data = response.iv ? await Decrypt(response.data) : response.data;
        const { mangas }: APIMangas = JSON.parse(data);
        return !mangas ? [] : mangas.map(manga => new Manga(this, provider, manga.id.toString(), manga.title.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(manga.Identifier, this.apiUrl));
        const response = await FetchJSON<APIResult>(request);
        const strdata = response.iv ? await Decrypt(response.data) : JSON.stringify(response);
        const tmpdata: PackedData | APIChapters = JSON.parse(strdata);
        const chapters: APIChapters = (tmpdata as PackedData).isCompact ? Unpack(tmpdata as PackedData) as APIChapters : tmpdata as APIChapters;
        return chapters.mangaReleases.map(chapter => {
            const team = chapter.teams.find(t => t.id === chapter.team_id);
            let title = 'Vol.' + chapter.volume + ' Ch.' + chapter.chapter;
            title += chapter.title ? ' - ' + chapter.title : '';
            title += team.name ? ' [' + team.name + ']' : '';
            //url format /mangas/<mangaid>/anything/<chapterNumber>
            const id = [manga.Identifier, manga.Title, chapter.chapter].join('/');
            return new Chapter(this, manga, id, title);
        });

    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(new URL(`/mangas/${chapter.Identifier}`, this.URI));
        const response = await FetchCSS(request, 'script[data-component-name="HomeApp"]');
        const data: APIPages = JSON.parse(response[0].textContent);

        const url = (data.globals.wla.configs.http_media_server || data.globals.wla.configs.media_server) + '/uploads/releases/';
        let images: string[] = [];

        if (data.readerDataAction.readerData.release.hq_pages?.length > 0) {
            images = data.readerDataAction.readerData.release.hq_pages.split('\r\n');
        } else if (data.readerDataAction.readerData.release.mq_pages?.length > 0) {
            images = data.readerDataAction.readerData.release.mq_pages.split('\r\n');
        } else if (data.readerDataAction.readerData.release.lq_pages?.length > 0) {
            images = data.readerDataAction.readerData.release.lq_pages.split('\r\n');
        }

        return images.map(image => {
            return new Page(this, chapter, new URL(image, url));
        });
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        let data = await Common.FetchImageAjax.call(this, page, priority, signal);
        if (data.type === 'text/html') {
            page.Link.href = new URL(page.Link.href.replace('/hq', '/mq')).href;
            data = await Common.FetchImageAjax.call(this, page, priority, signal);
        }
        return data;
    }

}

function Unpack(t: PackedData | APIData, ...args) {
    const e = arguments.length > 1 && void 0 !== args[1] ? args[1] : 1;
    if (!t || e > t.maxLevel)
        return t;
    if (typeof t != 'object' || !t.isCompact)
        return t;
    const n = (t as PackedData).cols;
    const r = (t as PackedData).rows;
    if (t.isObject) {
        const o = {};
        let i = 0;
        return n.forEach(function (t) {
            o[t] = Unpack(r[i], e + 1);
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

async function Decrypt(t: string): Promise<string> {
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
        }, true, ['decrypt']);

    const decrypted = await crypto.subtle.decrypt({
        name: 'AES-CBC',
        iv: iv
    }, secretKey, plaintext);

    return new TextDecoder('utf-8').decode(decrypted);
}
