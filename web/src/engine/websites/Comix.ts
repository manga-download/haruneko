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
        const encodingAlgo = response.headers.get('X-Enc-Algo');
        const scrambleAlgo = response.headers.get('X-Scramble-Algo');
        const scrambleGrid = response.headers.get('X-Scramble-Grid');
        const scrambleSeed = parseInt(response.headers.get('X-Scramble-Seed'), 10);
        const scrambleHash = response.headers.get('X-Scramble-Hash')?.trim();
        const seed = (scrambleHash === '03632' ? 58414 : scrambleHash === '02900' ? 117532 : 0) ^ scrambleSeed;

        const blob = encodingSeed && encodingLimit ? await this.#DecryptImage(buffer, parseInt(encodingSeed, 10), parseInt(encodingLimit, 10), encodingAlgo) : await Common.GetTypedData(buffer);
        return !scrambleAlgo || !scrambleSeed || !scrambleGrid ? blob : await DeScramble(blob, async (image, ctx) => {
            const GRID_ROWS = parseInt(scrambleGrid.split('x').at(0), 10);
            const GRID_COLS = parseInt(scrambleGrid.split('x').at(1), 10);
            const NUM_TILES = GRID_ROWS * GRID_COLS;

            const tileW = Math.floor(image.width / GRID_COLS);
            const tileH = Math.floor(image.height / GRID_ROWS);

            const scrambleOrder = scrambleAlgo === '3' ? this.#BuildOrder(seed, NUM_TILES) : this.#BuildOrderLcg(seed, NUM_TILES);

            ctx.drawImage(image, 0, 0);
            for (let tileIndex = 0; tileIndex < NUM_TILES; tileIndex++) {
                const srcIdx = scrambleOrder[tileIndex];

                const srcCol = srcIdx % GRID_COLS;
                const srcRow = Math.floor(srcIdx / GRID_COLS);

                const dstCol = tileIndex % GRID_COLS;
                const dstRow = Math.floor(tileIndex / GRID_COLS);

                const sx = srcCol * tileW;
                const sy = srcRow * tileH;

                const dx = dstCol * tileW;
                const dy = dstRow * tileH;

                ctx.drawImage(image, sx, sy, tileW, tileH, dx, dy, tileW, tileH);
            }
        });
    }

    async #DecryptImage(encrypted: ArrayBuffer, key: number, limit: number, algorithm: string = undefined): Promise<Blob> {
        if (algorithm != '2') return await Common.GetTypedData(this.#DecryptWithLCG(encrypted, key, limit));

        const decoders: Array<() => ArrayBuffer> = [
            () => this.#DecryptWithPRNG(encrypted, key | 1, limit, false),
            () => this.#DecryptWithPRNG(encrypted, key, limit, false),
            () => this.#DecryptWithPRNG(encrypted, key | 1, limit, true),
            () => this.#DecryptWithLCG(encrypted, key, limit),
        ];

        for (const decodeFn of decoders) {
            const blob = await Common.GetTypedData(decodeFn());
            if (blob.type.startsWith('image/')) return blob;
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

    #DecryptWithPRNG(encrypted: ArrayBuffer, key: number, limit: number, highByte: boolean): ArrayBuffer {
        const bytes = new Uint8Array(encrypted);
        let state = key | 0;
        for (let i = 0; i < Math.min(bytes.length, limit); i++) {
            state = (state ^= state << 13, state ^= state >>> 17, state ^= state << 5);
            key = highByte ? state >>> 24 : state & 0xFF;
            bytes[i] = bytes[i] ^ key;
        }
        return bytes.buffer;
    }

    #BuildOrder(seed: number, n: number): number[] {
        const arr: number[] = Array.from({ length: n }, (_, i) => i);
        let state = seed | 1;
        for (let i = n - 1; i >= 1; i--) {
            state = state ^ state << 13;
            state = state ^ state >>> 17;
            state = state ^ state << 5;
            const j = (state >>> 0) % (i + 1);
            const tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }
        const inverse: number[] = new Array(n);
        for (let i = 0; i < arr.length; i++) {
            inverse[arr[i]] = i;
        }
        return inverse;
    }

    #BuildOrderLcg(seed: number, n: number): number[] {
        const arr: number[] = Array.from({ length: n }, (_, i) => i);
        let state = seed;
        for (let i = n - 1; i >= 1; i--) {
            state = state * 1664525 + 1013904223;
            const j = (state >>> 0) % (i + 1);
            const tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }
        const inverse: number[] = new Array(n);
        for (let i = 0; i < arr.length; i++) {
            inverse[arr[i]] = i;
        }
        return inverse;
    }
}