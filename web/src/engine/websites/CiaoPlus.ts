import { Tags } from '../Tags';
import icon from './CiaoPlus.webp';
import type { MangaPlugin } from '../providers/MangaPlugin';
import { Chapter, DecoratableMangaScraper, Manga, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';
import { GetHexFromBytes, GetBytesFromUTF8 } from '../BufferEncoder';

type APIManga = {
    title_list: [ {
        title_id: number;
        title_name: string;
        episode_id_list: number[];
    } ];
};

type APIChapters = {
    episode_list: {
        episode_id: number;
        episode_name: string;
    }[];
};

type APIPages = {
    scramble_seed?: number;
    page_list: string[];
};

type PageSeed = {
    seed: number;
};

// TODO: Check for possible revision

@Common.MangasNotSupported()
export default class extends DecoratableMangaScraper {

    protected readonly drm = new DRMProvider('https://api.ciao.shogakukan.co.jp/', {
        name: 'X-Bambi-Hash',
        seed: '',
    });

    public constructor (id = 'ciaoplus', label = 'Ciao Plus', url = 'https://ciao.shogakukan.co.jp', tags = [ Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official ]) {
        super(id, label, url, ...tags);
    }

    public override get Icon() {
        return icon;
    }

    async #FetchMangaInfo(mangaID: string): Promise<APIManga> {
        return this.drm.FetchAPI<APIManga>('./title/list', {
            platform: '3',
            title_id_list: mangaID,
        });
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/comics/title/\\d+/.*`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { title_list: [ { title_id, title_name } ] } = await this.#FetchMangaInfo(new URL(url).pathname.split('/').at(3));
        return new Manga(this, provider, title_id.toString(), title_name.trim());
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { title_list: [ { episode_id_list } ] } = await this.#FetchMangaInfo(manga.Identifier);
        return this.FetchChapterList(manga, episode_id_list);
    }

    protected async FetchChapterList(manga: Manga, chapterIDs: number[]): Promise<Chapter[]> {
        const chapters: Chapter[] = [];
        while (chapterIDs.length > 0) {
            const { episode_list } = await this.drm.FetchAPI<APIChapters>(`./episode/list`, {
                platform: '3',
                episode_id_list: chapterIDs.splice(0, 50).join(','),
            });
            chapters.push(...episode_list.map(chapter => new Chapter(this, manga, chapter.episode_id.toString(), chapter.episode_name.trim())));
        };
        return chapters;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageSeed>[]> {
        const { page_list, scramble_seed } = await this.drm.FetchAPI<APIPages>('./web/episode/viewer', {
            platform: '3',
            episode_id: chapter.Identifier,
        });
        return page_list.map(page => new Page<PageSeed>(this, chapter, new URL(page), { seed: scramble_seed ?? 1 }));
    }

    public override async FetchImage(page: Page<PageSeed>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        return DeScramble(blob, async (image, ctx) => {
            ctx.drawImage(image, 0, 0);
            const tileInfo = GetTileInfo(image.width, image.height);
            for (const { source, dest } of GetTileMap(page.Parameters.seed)) {
                ctx.drawImage(
                    image,
                    source.x * tileInfo.width,
                    source.y * tileInfo.height,
                    tileInfo.width,
                    tileInfo.height,
                    dest.x * tileInfo.width,
                    dest.y * tileInfo.height,
                    tileInfo.width,
                    tileInfo.height
                );
            }
        });
    }
}

// TODO: Integration => https://github.com/manga-download/haruneko/commit/72a42dc5b3615af0c01588bc1c8d4db14a36a799#diff-0f4fdeca648eb4546349d45ef81d6abca1844a3dc84b0863ce3073832853792a
export class DRMProvider {

    constructor (private readonly apiURL: string, readonly requestHeaderHash: { name: string, seed: string; }) { }

    public async FetchAPI<T extends JSONElement>(endpoint: string, parameters: Record<string, string>, init: RequestInit = { method: 'GET' }): Promise<T> {
        const request = await this.#CreateRequest(endpoint, init, parameters);
        return FetchJSON<T>(request);
    }

    async #CreateRequest(endpoint: string, init: RequestInit, parameters: Record<string, string>) {
        const payload = new URLSearchParams(parameters);
        const uri = new URL(endpoint, this.apiURL);
        if (/^POST$/i.test(init.method)) {
            init.body = payload;
        } else {
            uri.search = payload.toString();
        }
        const request = new Request(uri, init);
        request.headers.set(this.requestHeaderHash.name, await this.#ComputeHash(payload, this.requestHeaderHash.seed));
        return request;
    }

    async #ComputeHash(parameters: URLSearchParams, seed: string): Promise<string> {
        parameters.sort();
        const parameterHashes = await Promise.all([ ...parameters.entries() ].map(async ([ key, value ]) => [
            await this.#ComputeSHA(key, 'SHA-256'),
            await this.#ComputeSHA(value, 'SHA-512'),
        ].join('_')));
        const aggreagteHash = await this.#ComputeSHA(parameterHashes.join(','), 'SHA-256');
        return this.#ComputeSHA(aggreagteHash + seed, 'SHA-512');
    }

    async #ComputeSHA(text: string, algorithm: 'SHA-256' | 'SHA-512'): Promise<string> {
        const hash = await crypto.subtle.digest(algorithm, GetBytesFromUTF8(text));
        return GetHexFromBytes(new Uint8Array(hash));
    }
}

// Copy & Paste from Website

const COL_NUM = 4;

function GetTileInfo(imageWidth: number, imageHeight: number) {
    return getPieceDimension(imageWidth, imageHeight, COL_NUM);
}

function GetTileMap(seed: number) {
    return xs(COL_NUM, seed);
}

function getPieceDimension(width: number, height: number, t: number) {
    if (width < t || height < t) return null;
    const s = Cs(t, 8);
    return width > s && height > s && (width = Math.floor(width / s) * s, height = Math.floor(height / s) * s),
    {
        width: Math.floor(width / t),
        height: Math.floor(height / t)
    };
}

function Cs(e: number, i: number): number {
    e > i && ([ e, i ] = [ i, e ]);
    const t = (s, o) => s ? t(o % s, s) : o;
    return e * i / t(e, i);
}

const xs = function* (e: number, i: number) {
    yield* Is([ ...Array(e ** 2) ].map((s, o) => o), i).map(
        (s, o) => ({
            source: {
                x: s % e,
                y: Math.floor(s / e)
            },
            dest: {
                x: o % e,
                y: Math.floor(o / e)
            }
        })
    );
};

function Is(e: number[], seed: number): number[] {
    const t = Ls(seed);
    return e.map(o => [ t.next().value, o ]).sort((o, r) => + (o[ 0 ] > r[ 0 ]) - + (r[ 0 ] > o[ 0 ])).map(o => o[ 1 ]);
}

const Ls = function* (seed: number) {
    const i = Uint32Array.of(seed);
    for (; ;) i[ 0 ] ^= i[ 0 ] << 13, i[ 0 ] ^= i[ 0 ] >>> 17, i[ 0 ] ^= i[ 0 ] << 5, yield i[ 0 ];
};