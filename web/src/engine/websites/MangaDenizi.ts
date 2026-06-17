import { Tags } from '../Tags';
import icon from './MangaDenizi.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import { Fetch, FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import { GetTypedData } from './decorators/Common';
import DeScramble from '../transformers/ImageDescrambler';

type APIManga = {
    data: {
        manga: {
            slug: string;
            title: string;
        };
    }
};

type APIMangas = {
    data: {
        manga: {
            data: {
                slug: string;
                title: string;
            }[];
        };
    }
};

type APIChapters = {
    data: {
        manga: {
            chapters: {
                slug: string;
                number: number;
                title: string;
            }[];
        };
    }
};

type APIPages = {
    pages: {
        image_url: string;
        scramble: {
            method: string;
            seed: number;
            grid: number;
        }
    }[];
};

type PageData = {
    Algorithm: string;
    Init: number;
    Grid: number;
};

class PRNG {

    #state: number;
    readonly #seed: number;

    constructor(init: number, salt: number) {
        const UInt32 = this.#ToUInt32;
        this.#seed = UInt32(UInt32(init) ^ UInt32(salt)) || 0x9E3779B9;
        this.#state = this.#seed;
    }

    #ToUInt32(value: number) {
        return value >>> 0;
    }

    /**
     * Get the next pseudo random number with `XorShift32`.
     */
    #Next() {
        const UInt32 = this.#ToUInt32;
        this.#state = UInt32(this.#state ^ UInt32(this.#state << 13));
        this.#state = UInt32(this.#state ^ this.#state >>> 17);
        this.#state = UInt32(this.#state ^ UInt32(this.#state << 5));
        return this.#state;
    };

    /**
     * Create a sequence of numbers shuffled by `Fisher-Yates` algorithm.
     * Uses `XorShift32` algorithm as the underlying random number generator.
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

export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/v1/web/ `;

    public constructor() {
        super('mangadenizi', 'Manga Denizi', 'https://mangadenizi.net', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { data: { manga: { title, slug } } } = await FetchJSON<APIManga>(new Request(new URL(`./manga/${url.split('/').at(-1)}`, this.apiURL)));
        return new Manga(this, provider, slug, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data: { manga: { data } } } = await FetchJSON<APIMangas>(new Request(new URL(`./manga?page=${page}`, this.apiURL)));
                const mangas = data.map(({ title, slug }) => new Manga(this, provider, slug, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data: { manga: { chapters } } } = await FetchJSON<APIChapters>(new Request(new URL(`./manga/${manga.Identifier}`, this.apiURL)));
        return chapters.map(({ slug, number, title }) => new Chapter(this, manga, slug, ['Bölüm', number, title ? '-' : '', title].join(' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageData>[]> {
        const { pages } = await FetchJSON<APIPages>(new Request(new URL(`./read/${chapter.Parent.Identifier}/${chapter.Identifier}/payload`, this.apiURL)));
        return pages.map(({ image_url: url, scramble: { method, seed, grid } }) => new Page<PageData>(this, chapter, new URL(url), { Algorithm: method, Init: seed, Grid: grid }));
    };

    public override async FetchImage(page: Page<PageData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const response = await this.imageTaskPool.Add(() => Fetch(new Request(page.Link)), priority, signal);
        const algorithm = page.Parameters.Algorithm || response.headers.get('X-Scramble-Method') || response.headers.get('X-Scrambled-Method');
        switch (algorithm) {
            case 'xor': {
                const key = parseInt(response.headers.get('X-Scramble-Key'), 10);
                const bytes = new Uint8Array(await response.arrayBuffer()).map(byte => byte ^ key);
                return GetTypedData(bytes.buffer);
            }
            case 'tiled-v1': {
                const seed = page.Parameters.Init ?? parseInt(response.headers.get('X-Scramble-Seed'), 10);
                const grid = page.Parameters.Grid ?? parseInt(response.headers.get('X-Scramble-Grid'), 10);
                return DeScramble(await response.blob(), async (image, ctx) => this.#RenderTilesV1(image, ctx, seed, grid));
            }
            default: {
                return GetTypedData(await response.arrayBuffer());
            }
        }
    }

    #RenderTilesV1(image: ImageBitmap, ctx: OffscreenCanvasRenderingContext2D, init: number, grid: number) {

        function SplitDimensionIntoRegions(totalSize: number, regionCount: number) {
            const size = Math.max(1, Math.floor(totalSize));
            const count = Math.max(1, Math.min(Math.floor(regionCount) || 1, size));
            return Array.from({ length: count }, (_, regionIndex) => {
                const startOffset = Math.floor(regionIndex * size / count);
                const endOffset = Math.floor((regionIndex + 1) * size / count);
                return {
                    offset: startOffset,
                    length: Math.max(1, endOffset - startOffset)
                };
            });
        };

        const canvasWidth = Math.max(1, Math.floor(image.width));
        const canvasHeight = Math.max(1, Math.floor(image.height));
        const gridSize = Math.max(1, Math.min(Math.floor(grid) || 1, canvasWidth, canvasHeight));
        const columnRegions = SplitDimensionIntoRegions(canvasWidth, gridSize);
        const rowRegions = SplitDimensionIntoRegions(canvasHeight, gridSize);
        const shuffledColumns = new PRNG(init, 0x85EBCA6B).Next(gridSize);
        const shuffledRows = new PRNG(init, 0X9E3779B9).Next(gridSize);

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        for (let row = 0; row < gridSize; row += 1) {
            const srcTileY = rowRegions[row];
            const dstTileY = rowRegions[shuffledRows[row]];

            for (let column = 0; column < gridSize; column += 1) {
                const srcTileX = columnRegions[column];
                const dstTileX = columnRegions[shuffledColumns[column]];
                ctx.drawImage(image, srcTileX.offset, srcTileY.offset, srcTileX.length, srcTileY.length, dstTileX.offset, dstTileY.offset, dstTileX.length, dstTileY.length);
            }
        }
    }
}