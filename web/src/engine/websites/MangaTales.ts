import { Tags } from '../Tags';
import icon from './MangaTales.webp';
import { Chapter, DecoratableMangaScraper, Page, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import { Fetch, FetchCSS, FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';

type EncryptedData = {
    iv: boolean,
    data: string;
};

type PackedData = Record<string, JSONElement> & {
    cols: string[],
    isCompact: boolean,
    isObject: boolean,
    isArray: boolean,
    maxLevel: number,
    rows: PackedData[],
}

type MangaSearchRestriction = {
    include: string[],
    exclude: string[],
};

type MangaSearch = {
    title?: string,
    oneshot?: boolean,
    manga_types: MangaSearchRestriction,
    story_status: MangaSearchRestriction,
    translation_status: MangaSearchRestriction,
    categories: MangaSearchRestriction,
    chapters: {
        min?: string,
        max?: string,
    },
    dates: {
        start?: string,
        end?: string,
    },
    page: number
};

type APISingleManga = {
    mangaDataAction: {
        mangaData: {
            id: number,
            title: string
        }
    }
};

type APIMangas = {
    mangas?: {
        id: number,
        title: string
    }[]
};

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
};

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
};

export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://mangatales.com/api/mangas/';

    public constructor() {
        super('mangatales', 'MangaTales', 'https://mangatales.com', Tags.Language.Arabic, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/mangas/\\d+/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const elements = await FetchCSS(new Request(url), 'script[data-component-name="HomeApp"]');
        const { mangaDataAction: { mangaData } } = JSON.parse(elements.shift().textContent) as APISingleManga;
        return new Manga(this, provider, mangaData.id.toString(), mangaData.title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList : Manga[]= [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(provider, page);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(provider: MangaPlugin, page: number): Promise<Manga[]> {
        const unrestricted = { include: [], exclude: [] };
        const request = new Request(new URL('search', this.apiUrl), {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(<MangaSearch>{
                manga_types: unrestricted,
                story_status: unrestricted,
                translation_status: unrestricted,
                categories: unrestricted,
                chapters: {},
                dates: {},
                page,
            }),
        });

        const data = await FetchJSON<EncryptedData | PackedData | APIMangas>(request);
        const { mangas } = TryUnpack(await TryDecrypt(data));
        return mangas?.map(manga => new Manga(this, provider, manga.id.toString(), manga.title.trim())) ?? [];
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(manga.Identifier, this.apiUrl));
        const data = await FetchJSON<EncryptedData & PackedData & APIChapters>(request);
        return TryUnpack(await TryDecrypt(data)).mangaReleases.map(chapter => {
            const team = chapter.teams.find(team => team.id === chapter.team_id);
            const title = [
                'Vol.' + chapter.volume,
                'Ch.' + chapter.chapter,
                chapter.title || team?.name ? '-' : '',
                chapter.title || '',
                team?.name ? `[${team.name}]` : '',
            ].join(' ');
            const id = [ manga.Identifier, manga.Title, chapter.chapter ].join('/'); // slug
            return new Chapter(this, manga, id, title.trim());
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(new URL(`/mangas/${chapter.Identifier}`, this.URI));
        const response = await FetchCSS(request, 'script[data-component-name="HomeApp"]');
        const { globals: { wla: { configs } }, readerDataAction: { readerData: { release } } } = JSON.parse(response[0].textContent) as APIPages;
        const url = (configs.http_media_server || configs.media_server) + '/uploads/releases/';
        return (release.hq_pages || release.mq_pages || release.lq_pages).split('\r\n').map(image => new Page(this, chapter, new URL(image, url)));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            for(const quality of ['/hq', '/mq', '/lq']) {
                const imageLink = page.Link;
                const request = new Request(imageLink.href.replace('/hq', quality), {
                    signal,
                    headers: {
                        Referer: page.Parameters?.Referer ?? imageLink.origin,
                    }
                });
                const response = await Fetch(request);
                const data = await response.blob();
                if(data.type.startsWith('image/')) {
                    return data;
                }
            }
        }, priority, signal);
    }
}

function TryUnpack<T>(data: PackedData | T): T {
    return <T>(data['isCompact'] === true || data['isCompact'] === false ? Unpack(data as PackedData) : data);
}

function Unpack(t: PackedData, ...args: number[]) {
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

async function TryDecrypt<T>(data: EncryptedData | T): Promise<T> {
    return <T>(data['iv'] ? JSON.parse(await Decrypt((data as EncryptedData).data)) : data);
}

async function Decrypt(serialized: string): Promise<string> {
    const encrypted = serialized.split('|');
    const data = Buffer.from(encrypted[0], 'base64');
    const cipher = { name: 'AES-CBC', iv: Buffer.from(encrypted[2], 'base64') };
    const hash = await crypto.subtle.digest('SHA-256', Buffer.from(encrypted[3]));
    const key = await crypto.subtle.importKey('raw', Buffer.from(hash), { name: 'AES-CBC', length: 128 }, true, [ 'decrypt' ]);
    const decrypted = await crypto.subtle.decrypt(cipher, key, data);
    return new TextDecoder('utf-8').decode(decrypted);
}