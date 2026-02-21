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
    title_list: [{
        title_id: number;
        title_name: string;
        episode_id_list: number[];
    }];
};

type APIChapters = {
    episode_list: {
        episode_id: number;
        episode_name: string;
    }[];
};

type APIPages = {
    scramble_seed?: number;
    scramble_ver?: number;
    page_list: string[];
};

type PageInfo = {
    seed: number;
    version: number;
};

// TODO: Check for possible revision

@Common.MangasNotSupported()
export default class extends DecoratableMangaScraper {

    protected readonly drm = new DRMProvider('https://api.ciao.shogakukan.co.jp/', {
        name: 'X-Bambi-Hash',
        seed: '',
    },
    { headers: { 'x-bambi-is-crawler': 'false' } }, //headers for all requests
    { version: '6.0.0', platform: '3' } //urlparams for all requests
    );

    public constructor(id = 'ciaoplus', label = 'Ciao Plus', url = 'https://ciao.shogakukan.co.jp', tags = [Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official]) {
        super(id, label, url, ...tags);
    }

    public override get Icon() {
        return icon;
    }

    async #FetchMangaInfo(mangaID: string): Promise<APIManga> {
        return this.drm.FetchAPI<APIManga>('./title/list', {
            title_id_list: parseInt(mangaID).toString()//to remove leading 0,
        });
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/comics/title/\\d+/.*`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { title_list: [{ title_id, title_name }] } = await this.#FetchMangaInfo(new URL(url).pathname.split('/').at(3));
        return new Manga(this, provider, title_id.toString(), title_name.trim());
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { title_list: [{ episode_id_list }] } = await this.#FetchMangaInfo(manga.Identifier);
        return this.FetchChapterList(manga, episode_id_list);
    }

    protected async FetchChapterList(manga: Manga, chapterIDs: number[]): Promise<Chapter[]> {
        const chapters: Chapter[] = [];
        while (chapterIDs.length > 0) {
            const { episode_list } = await this.drm.FetchAPI<APIChapters>(`./episode/list`, {
                episode_id_list: chapterIDs.splice(0, 50).join(','),
            });
            chapters.push(...episode_list.map(chapter => new Chapter(this, manga, chapter.episode_id.toString(), chapter.episode_name.trim())));
        };
        return chapters;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageInfo>[]> {
        const { page_list, scramble_ver, scramble_seed } = await this.drm.FetchAPI<APIPages>('./web/episode/viewer', {
            episode_id: chapter.Identifier,
        });
        // ShonenMagazine uses the same scrambling algorithm as CiaoPlus v2, but reports scramble_version as 1.
        // Set version to -1 here to force the correct descrambling function.
        return page_list.map(page => new Page<PageInfo>(this, chapter, new URL(page), { seed: scramble_seed ?? 1, version: scramble_ver ?? -1 }));
    }

    public override async FetchImage(page: Page<PageInfo>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        return DeScramble(blob, async (image, ctx) => {
            ctx.drawImage(image, 0, 0);
            // source code: const i = r === 1 ? tt(e.width, e.height, t) : nt(e.width, e.height, t);
            const i = page.Parameters.version === 1 ? ComputeLCMBlockDimensions(image.width, image.height, COL_NUM) : ComputeGridBlockDimensions(image.width, image.height, COL_NUM);
            for (const c of GenerateScrambleMapping(COL_NUM, page.Parameters.seed)) {
                ctx.drawImage(
                    image,
                    c.source.x * i.width,
                    c.source.y * i.height,
                    i.width, i.height,
                    c.dest.x * i.width,
                    c.dest.y * i.height,
                    i.width, i.height
                );
            }
        });
    }
}

export class DRMProvider {

    constructor(private readonly apiURL: string, readonly requestHeaderHash: { name: string, seed: string; },
        readonly fixedHeaders: RequestInit = {}, readonly fixedUrlParams: Record<string, string> = {}) { }

    public async FetchAPI<T extends JSONElement>(endpoint: string, parameters: Record<string, string>, init: RequestInit = { method: 'GET' }): Promise<T> {
        const request = await this.#CreateRequest(endpoint, init, parameters);
        return FetchJSON<T>(request);
    }

    async #CreateRequest(endpoint: string, init: RequestInit, parameters: Record<string, string>) {
        const payload = new URLSearchParams(parameters);
        const uri = new URL(endpoint, this.apiURL);
        uri.search = payload.toString();

        for (let key in this.fixedUrlParams) {
            uri.searchParams.set(key, this.fixedUrlParams[key]);
        }

        const request = new Request(uri, { ...init, ...this.fixedHeaders });
        request.headers.set(this.requestHeaderHash.name, await this.#ComputeHash(uri.searchParams, this.requestHeaderHash.seed));
        return request;
    }

    async #ComputeHash(parameters: URLSearchParams, seed: string): Promise<string> {
        parameters.sort();
        const parameterHashes = await Promise.all([...parameters.entries()].map(async ([key, value]) => [
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
const O = 8;

// ot
const CreateXorShift32 = function* (seed: number) {
    const e = Uint32Array.of(seed);
    for (; ;) {
        e[0] ^= e[0] << 13;
        e[0] ^= e[0] >>> 17;
        e[0] ^= e[0] << 5;
        yield e[0];
    }
};

// at
const ShuffleArrayWithPRNG = (array: any[], seed: number) => {
    const t = CreateXorShift32(seed);
    return array
        .map((r) => [t.next().value, r])
        .sort((r, i) => +(r[0] > i[0]) - +(i[0] > r[0]))
        .map((r) => r[1]);
};

// it
const GenerateScrambleMapping = function* (gridSize: number, seed: number) {
    yield* ShuffleArrayWithPRNG(
        [...Array(gridSize ** 2)].map((s, r) => r),
        seed
    ).map((s, r) => ({
        source: {
            x: s % gridSize,
            y: Math.floor(s / gridSize),
        },
        dest: {
            x: r % gridSize,
            y: Math.floor(r / gridSize),
        },
    }));
};

// st
const GetLeastCommonMultiple = (a: number, b: number) => {
    const t = function t(s: number, r: number): number {
        return s ? t(r % s, s) : r;
    };
    return a * b / t(a, b);
};

// tt
const ComputeLCMBlockDimensions = (width: number, height: number, gridSize: number) => {
    if (width < gridSize || height < gridSize) {
        return null;
    }
    const s = GetLeastCommonMultiple(gridSize, O);
    if (width > s && height > s) {
        width = Math.floor(width / s) * s;
        height = Math.floor(height / s) * s;
    }
    return {
        width: Math.floor(width / gridSize),
        height: Math.floor(height / gridSize),
    };
};

// nt
const ComputeGridBlockDimensions = (width: number, height: number, gridSize: number) => {
    if (width < gridSize * O || height < gridSize * O) {
        return null;
    }
    const s = Math.floor(width / O);
    const r = Math.floor(height / O);
    const i = Math.floor(s / gridSize);
    const c = Math.floor(r / gridSize);
    return {
        width: i * O,
        height: c * O
    };
};
