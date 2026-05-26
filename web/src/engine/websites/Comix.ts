import { Tags } from '../Tags';
import icon from './Comix.webp';
import { Fetch, FetchJSON } from '../platform/FetchProvider';
import { Page } from '../providers/MangaPlugin';
import { type MangaPlugin, Manga, Chapter, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { DRMProvider } from './Comix.DRM';
import type { Priority } from '../taskpool/DeferredTask';
import { GetTypedData } from './decorators/Common';
import DeScramble from '../transformers/ImageDescrambler';

type APIMangas = {
    result: {
        items: {
            hash_id: string;
            title: string;
            slug: string;
        }[];
    };
};

class PRNG {

    #state: bigint;
    readonly #seed: bigint;

    constructor(private readonly seed: number) {
        this.#seed = BigInt(seed);
        this.#state = this.#seed;
    }

    /**
     * Get the next pseudo random number with `Linear Congruential Generator`.
     */
    #Next() {
        this.#state = this.#state * 1664525n + 1013904223n & 0xffffffffn;
        return Number(this.#state);
    };

    /**
     * Create a sequence of numbers shuffled by `Fisher-Yates` algorithm.
     * Uses `Linear Congruential Generator` as the underlying random number generator.
     */
    public Next(count: number) {
        this.#state = this.#seed;
        const indices = [...new Array(Math.max(1, count)).keys()];
        for (let current = indices.length - 1; current > 0; current--) {
            const randomIndex = this.#Next() % (current + 1);
            [indices[current], indices[randomIndex]] = [indices[randomIndex], indices[current]];
        }
        return indices;
    }
}

@Common.MangaCSS(/^{origin}\/title\/[^/]+$/, 'meta[property="og:title"]')
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/v1/`;
    readonly #drm = new DRMProvider();

    public constructor() {
        super('comix', 'Comix', 'https://comix.to', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
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
            const title = [number?.toString(), name && `- ${name}`, group && `[${group.name}]`].filter(Boolean).join(' ');
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
                Referer: page.Parameters.Referer
            }
        })), priority, signal);

        const seed = parseInt(response.headers.get('X-Scramble-Seed'), 10);
        const grid = response.headers.get('X-Scramble-Grid');
        const blob = await GetTypedData(await response.arrayBuffer());

        return seed ? DeScramble(blob, async (image, ctx) => this.#RenderTiles(image, ctx, seed, grid)) : blob;
    }

    #RenderTiles(image: ImageBitmap, ctx: OffscreenCanvasRenderingContext2D, init: number, grid: string) {
        const [numRows, numColumns] = grid.split('x').map(el => parseInt(el, 10));
        const tileWidth = Math.floor(image.width / numColumns);
        const tileHeight = Math.floor(image.height / numRows);
        const tileIndexMap = new PRNG(init).Next(numRows * numColumns);

        for (let srcTileIndex = 0; srcTileIndex < tileIndexMap.length; srcTileIndex++) {
            const dstTileIndex = tileIndexMap[srcTileIndex];
            const srcOffsetX = srcTileIndex % numColumns * tileWidth;
            const srcOffsetY = Math.floor(srcTileIndex / numColumns) * tileHeight;
            const dstOffsetX = dstTileIndex % numColumns * tileWidth;
            const dstOffsetY = Math.floor(dstTileIndex / numColumns) * tileHeight;
            ctx.drawImage(image, srcOffsetX, srcOffsetY, tileWidth, tileHeight, dstOffsetX, dstOffsetY, tileWidth, tileHeight);
        }
    }
}