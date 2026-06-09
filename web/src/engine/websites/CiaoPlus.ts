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
    scramble_seed?: number | string;
    scramble_ver?: number;
    page_list: string[];
};

type PageParameters = {
    Seed: number;
    Version: number;
};

type TDimension = {
    width: number;
    height: number;
};

class PRNG {
    #state: number;
    #gridSize: number;

    constructor(gridSize: number, seed: number) {
        this.#gridSize = gridSize;
        this.#state = seed >>> 0;
    }

    #Next(): number {
        this.#state ^= this.#state << 13;
        this.#state ^= this.#state >>> 17;
        this.#state ^= this.#state << 5;
        return this.#state >>> 0;
    }

    #Shuffle(array: number[]): number[] {
        return array
            .map((value) => [this.#Next(), value] as const)
            .sort((a, b) => +(a[0] > b[0]) - +(b[0] > a[0]))
            .map(([, value]) => value);
    }

    GenerateScrambleMapping() {
        const shuffled = this.#Shuffle(Array.from({ length: this.#gridSize * this.#gridSize }, (_, i) => i));
        return shuffled.map((sourceIndex, destIndex) => ({
            source: {
                x: sourceIndex % this.#gridSize,
                y: sourceIndex / this.#gridSize | 0,
            },
            dest: {
                x: destIndex % this.#gridSize,
                y: destIndex / this.#gridSize | 0,
            },
        }));
    }
}

// TODO: Major Code Revision
export class DRMProvider {

    constructor(private readonly apiURL: string, readonly requestHeaderHash: { name: string, seed: string; },
        readonly fixedHeaders: RequestInit = {}, readonly fixedUrlParams: Record<string, string> = {}) { }

    public async FetchAPI<T extends JSONElement>(endpoint: string, parameters: Record<string, string>, init: RequestInit = { method: 'GET' }): Promise<T> {
        return FetchJSON<T>(await this.#CreateRequest(endpoint, init, parameters));
    }

    async #CreateRequest(endpoint: string, init: RequestInit, parameters: Record<string, string>) {
        const payload = new URLSearchParams(parameters);
        const uri = new URL(endpoint, this.apiURL);
        uri.search = payload.toString();

        for (const key in this.fixedUrlParams) {
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
        const aggregateHash = await this.#ComputeSHA(parameterHashes.join(','), 'SHA-256');
        return this.#ComputeSHA(aggregateHash + seed, 'SHA-512');
    }

    async #ComputeSHA(text: string, algorithm: 'SHA-256' | 'SHA-512'): Promise<string> {
        const hash = await crypto.subtle.digest(algorithm, GetBytesFromUTF8(text));
        return GetHexFromBytes(new Uint8Array(hash));
    }
}

@Common.MangasNotSupported()
export default class extends DecoratableMangaScraper {

    readonly #alphabets = new Map<number, string>();

    protected readonly drm = new DRMProvider('https://api.ciao.shogakukan.co.jp/', {
        name: 'X-Bambi-Hash',
        seed: '',
    }, {
        headers: {
            'X-Bambi-Is-Crawler': 'false'
        }
    }, {
        version: '6.0.0', platform: '3'
    });

    public constructor(id = 'ciaoplus', label = 'Ciao Plus', url = 'https://ciao.shogakukan.co.jp', tags = [Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official]) {
        super(id, label, url, ...tags);
    }

    public override get Icon() {
        return icon;
    }

    public WithAlphabet(residual: number, alphabet: string) {
        this.#alphabets.set(residual, alphabet);
        return this;
    }

    async #FetchMangaInfo(mangaID: string): Promise<APIManga> {
        return this.drm.FetchAPI<APIManga>('./title/list', {
            title_id_list: parseInt(mangaID, 10).toString()
        });
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/comics/title/\\d+/.*`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { title_list: [{ title_id, title_name }] } = await this.#FetchMangaInfo(new URL(url).pathname.split('/').at(3));
        return new Manga(this, provider, `${title_id}`, title_name.trim());
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
            chapters.push(...episode_list.map(({ episode_id: id, episode_name: name }) => new Chapter(this, manga, `${id}`, name.trim())));
        };
        return chapters;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const { page_list, scramble_ver, scramble_seed } = await this.drm.FetchAPI<APIPages>('./web/episode/viewer', {
            episode_id: chapter.Identifier,
        });
        // ShonenMagazine uses the same scrambling algorithm as CiaoPlus v2, but reports scramble_version as 1.
        // Set version to -1 here to force the correct descrambling function.

        // ShonenMagazine also use a string as seed, so we need to compute the correct seed (as a number)
        const mangaID = parseInt(chapter.Parent.Identifier, 10);
        const chapterID = parseInt(chapter.Identifier, 10);

        const seed = typeof scramble_seed === 'string' ? this.ComputeSeed32(scramble_seed, mangaID, chapterID) : scramble_seed ?? 1;
        return page_list.map(page => new Page<PageParameters>(this, chapter, new URL(page), { Seed: seed, Version: scramble_ver ?? -1 }));
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);

        const { Seed, Version } = page.Parameters;
        const numColumns = 4;
        const scaleFactor = 8;

        return DeScramble(blob, async (image, ctx) => {
            ctx.drawImage(image, 0, 0);
            const blockDimension = Version === 1 ? this.ComputeLCMBlockDimensions(image.width, image.height, numColumns, scaleFactor) : this.ComputeGridBlockDimensions(image.width, image.height, numColumns, scaleFactor);
            for (const piece of new PRNG(numColumns, Seed).GenerateScrambleMapping()) {
                ctx.drawImage(
                    image,
                    piece.source.x * blockDimension.width,
                    piece.source.y * blockDimension.height,
                    blockDimension.width, blockDimension.height,
                    piece.dest.x * blockDimension.width,
                    piece.dest.y * blockDimension.height,
                    blockDimension.width, blockDimension.height
                );
            }
        });
    }

    private ComputeSeed32(seed: string, titleId: number, episodeId: number): number {
        const alphabet = this.#alphabets.get(titleId % 2);
        let parsedInt = 0n;
        for (const char of seed) {
            const index = alphabet.indexOf(char);
            if (index !== -1) {
                parsedInt = parsedInt * 10n + BigInt(index);
            } else {
                break;
            }
        }
        const parsedUInt32 = Number(parsedInt & 0xFFFFFFFFn);
        const combined = (titleId >>> 0) + (episodeId >>> 0);
        return (parsedUInt32 ^ combined) >>> 0;
    };

    private ComputeLCMBlockDimensions(width: number, height: number, gridSize: number, scaleFactor: number): TDimension {
        if (width < gridSize || height < gridSize) {
            return null;
        }
        const s = this.GetLeastCommonMultiple(gridSize, scaleFactor);
        if (width > s && height > s) {
            width = Math.floor(width / s) * s;
            height = Math.floor(height / s) * s;
        }
        return {
            width: Math.floor(width / gridSize),
            height: Math.floor(height / gridSize),
        };
    };

    private ComputeGridBlockDimensions(width: number, height: number, gridSize: number, scaleFactor: number): TDimension {
        if (width < gridSize * scaleFactor || height < gridSize * scaleFactor) {
            return null;
        }
        const s = Math.floor(width / scaleFactor);
        const r = Math.floor(height / scaleFactor);
        const i = Math.floor(s / gridSize);
        const c = Math.floor(r / gridSize);
        return {
            width: i * scaleFactor,
            height: c * scaleFactor
        };
    };

    private GetLeastCommonMultiple(a: number, b: number): number {
        const gcd = (first: number, second: number): number => {
            return second === 0 ? first : gcd(second, first % second);
        };
        return a * b / gcd(a, b);
    }
}