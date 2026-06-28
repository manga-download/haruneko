import { Tags } from '../Tags';
import icon from './Comix.webp';
import { Fetch, FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { DRMProvider } from './Comix.DRM';
import DeScramble from '../transformers/ImageDescrambler';
import { RateLimit } from '../taskpool/RateLimit';

type APIMangas = {
    result: {
        items: {
            hash_id: string;
            title: string;
            slug: string;
        }[];
    };
};

const GetOdd = (value: number) => value | 1;

class PRNG {

    #state: number;

    readonly #seed: number;
    readonly #inits = {
        '': 0, // Define default/fallback
        '03632': 58414,
        '02900': 117532,
    };

    readonly #algorithms = {
        '': this.#NextLCG, // Define default/fallback
        '3': this.#NextXorShift32,
    };

    constructor(init: string, salt: number, algorithm?: string) {
        this.#seed = (this.#inits[init] ?? this.#inits['']) ^ salt;
        this.#seed = algorithm !== '3' ? this.#seed : GetOdd(this.#seed | 1);
        this.#Next = this.#algorithms[algorithm] ?? this.#algorithms[''];
    }

    readonly #Next: () => number;

    #NextLCG() {
        this.#state = this.#state * 1664525 + 1013904223;
        return this.#state >>> 0;
    }

    #NextXorShift32() {
        this.#state ^= this.#state << 13;
        this.#state ^= this.#state >>> 17;
        this.#state ^= this.#state << 5;
        return this.#state >>> 0;
    }

    public Sequence(count: number) {
        this.#state = this.#seed;
        const indices = [...new Array(Math.max(1, count)).keys()];
        for (let current = indices.length - 1; current > 0; current--) {
            const randomIndex = this.#Next.call(this) % (current + 1);
            [indices[current], indices[randomIndex]] = [indices[randomIndex], indices[current]];
        }

        const inverse: number[] = new Array(count);
        for (let i = 0; i < indices.length; i++) {
            inverse[indices[i]] = i;
        }
        return inverse;
    }
}

@Common.MangaCSS(/^{origin}\/title\/[^/]+$/, 'meta[property="og:title"]')
export default class extends DecoratableMangaScraper {

    readonly #drm = new DRMProvider();
    private readonly apiURL = `${this.URI.origin}/api/v1/`;

    public constructor() {
        super('comix', 'Comix', 'https://comix.to', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
        this.imageTaskPool.RateLimit = new RateLimit(4, 1);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { result: { items } } = await FetchJSON<APIMangas>(new Request(new URL(`./manga?limit=100&page=${page}`, this.apiURL)));
                const mangas = items.map(({ hash_id: hash, title, slug }) => new Manga(this, provider, `/title/${hash}-${slug}`, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await this.#drm.GetChaptersData(new URL(manga.Identifier, this.URI));
        return chapters.map(({ id, number, name, group }) => {
            const title = [number, name && `- ${name}`, group?.name && `[${group.name}]`].joinTitleSegments();
            return new Chapter(this, manga, `${manga.Identifier}/${id}-chapter-${number}`, title);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const images = await this.#drm.CreatePageLinks(new URL(chapter.Identifier, this.URI));
        return images.map(page => new Page(this, chapter, new URL(page), { Referer: this.URI.href }));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const response = await this.imageTaskPool.Add(() => Fetch(new Request(page.Link, {
            headers: {
                ...page.Link.href.endsWith('?v3') && { Origin: this.URI.origin },
                Referer: page.Parameters.Referer
            }
        })), priority, signal);

        const buffer = await response.arrayBuffer();
        const encodingSeed = response.headers.get('X-Enc-Seed');
        const encodingLimit = response.headers.get('X-Enc-Len');
        const encodingAlgorithm = response.headers.get('X-Enc-Algo');
        const blob = encodingSeed && encodingLimit ? await this.#DecryptImage(buffer, parseInt(encodingSeed, 10), parseInt(encodingLimit, 10), encodingAlgorithm) : await Common.GetTypedData(buffer);

        const scrambleGrid = response.headers.get('X-Scramble-Grid');
        const scrambleAlgorithm = response.headers.get('X-Scramble-Algo');
        const scambleSeedHash = response.headers.get('X-Scramble-Hash')?.trim() || '';
        const scambleSeedModifier = parseInt(response.headers.get('X-Scramble-Seed'), 10) || 0;

        return !scrambleGrid || !scrambleAlgorithm ? blob : await DeScramble(blob, async (image, ctx) => {
            const gridRowCount = parseInt(scrambleGrid.split('x').at(0), 10);
            const gridColumnCount = parseInt(scrambleGrid.split('x').at(1), 10);
            const tileWidth = Math.floor(image.width / gridColumnCount);
            const tileHeight = Math.floor(image.height / gridRowCount);
            const scrambleOrder = new PRNG(scambleSeedHash, scambleSeedModifier, scrambleAlgorithm).Sequence(gridRowCount * gridColumnCount);

            ctx.drawImage(image, 0, 0);
            for (let dstIndex = 0; dstIndex < scrambleOrder.length; dstIndex++) {
                const srcIndex = scrambleOrder[dstIndex];
                const srcColumn = srcIndex % gridColumnCount;
                const srcRow = Math.floor(srcIndex / gridColumnCount);
                const dstColumn = dstIndex % gridColumnCount;
                const dstRow = Math.floor(dstIndex / gridColumnCount);
                const srcX = srcColumn * tileWidth;
                const srcY = srcRow * tileHeight;
                const dstX = dstColumn * tileWidth;
                const dstY = dstRow * tileHeight;
                ctx.drawImage(image, srcX, srcY, tileWidth, tileHeight, dstX, dstY, tileWidth, tileHeight);
            }
        });
    }

    async #DecryptImage(encrypted: ArrayBuffer, key: number, limit: number, _algorithm: string = undefined): Promise<Blob> {
        // TODO: Derive from algorithm type, is decryption even used ???
        const decryptions = [
            () => this.#DecryptWithXorShift32(encrypted, GetOdd(key), limit, true),
            () => this.#DecryptWithXorShift32(encrypted, key, limit, true),
            () => this.#DecryptWithXorShift32(encrypted, GetOdd(key), limit, false),
            () => this.#DecryptWithXorShift32(encrypted, key, limit, false),
            () => this.#DecryptWithLCG(encrypted, GetOdd(key), limit),
            () => this.#DecryptWithLCG(encrypted, key, limit),
        ];

        for (const decrypt of decryptions) {
            const blob = await Common.GetTypedData(decrypt());
            if (blob.type.startsWith('image/')) {
                //console.log(this.Title, 'Detected Decryption:', _algorithm, decrypt);
                return blob;
            }
        }
    }

    #DecryptWithLCG(encrypted: ArrayBuffer, key: number, limit: number): ArrayBuffer {
        const bytes = new Uint8Array(encrypted);
        for (let i = 0; i < Math.min(bytes.length, limit); i++) {
            key = key * 1000005 + 1234567891 >> 0;
            bytes[i] = bytes[i] ^ key >>> 24;
        }
        return bytes.buffer;
    }

    #DecryptWithXorShift32(encrypted: ArrayBuffer, key: number, limit: number, highByte: boolean): ArrayBuffer {
        const bytes = new Uint8Array(encrypted);
        let state = key | 0;
        for (let i = 0; i < Math.min(bytes.length, limit); i++) {
            state = (state ^= state << 13, state ^= state >>> 17, state ^= state << 5);
            key = highByte ? state >>> 24 : state & 0xFF;
            bytes[i] = bytes[i] ^ key;
        }
        return bytes.buffer;
    }
}