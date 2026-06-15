import { Tags } from '../Tags';
import icon from './NexusScans.webp';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import type { Priority } from '../taskpool/DeferredTask';
import { FetchImageAjax } from './decorators/Common';
import DeScramble from '../transformers/ImageDescrambler';

type APIManga = {
    serie: {
        slug: string;
        titulo: string;
        tipo: string;
    };
};

type APIMangas = {
    data: APIManga['serie'][];
};

type APIChapters = {
    capitulos: {
        slug: string;
        numero: number;
    }[];
};

type APIPages = {
    data: {
        paginas: {
            url: string;
            sc?: {
                s: number;
                c: number;
                r: number;
            };
        }[];
    };
};

type PageParameters = {
    Seed?: number;
    Columns?: number;
    Rows?: number;
}

class PRNG {

    #state: number;
    readonly #seed: number;

    constructor(init: number) {
        this.#seed = init >>> 0;
        this.#state = this.#seed;
    }

    /**
     * Get the next pseudo random number with `Mulberry32`.
     */
    #Next() {
        this.#state |= 0;
        let result = Math.imul((this.#state = this.#state + 1831565813 | 0) ^ this.#state >>> 15, 1 | this.#state);
        result = result + Math.imul(result ^ result >>> 7, 61 | result) ^ result;
        return ((result ^ result >>> 14) >>> 0) / 4294967296;
    };

    /**
     * Create a sequence of numbers shuffled by `Fisher-Yates (variation)` algorithm.
     * Uses `Mulberry32` algorithm as the underlying random number generator.
     */
    public Sequence(count: number) {
        this.#state = this.#seed;
        const indices = [...new Array(Math.max(1, count)).keys()];
        for (let current = indices.length - 1; current > 0; current--) {
            const randomIndex = Math.floor(this.#Next() * (current + 1));
            [indices[current], indices[randomIndex]] = [indices[randomIndex], indices[current]];
        }
        return indices;
    }
}

export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://api.nexusscanlation.com/api/v1/';

    public constructor() {
        super('nexusscans', 'Nexus Scans', 'https://nexusscanlation.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Scanlator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `
            localStorage.setItem('nexus-age-filter', 'all');
            localStorage.setItem('nexus-age-prompt-seen', '1');
        `);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/series/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { serie: { slug, titulo } } = await FetchJSON<APIManga>(new Request(new URL(`./series/${url.split('/').at(-1)}`, this.apiURL)));
        return new Manga(this, provider, slug, titulo);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data } = await FetchJSON<APIMangas>(new Request(new URL(`./catalog?limit=50&page=${page}`, this.apiURL)));
                const mangas = data
                    .filter(({ tipo }) => tipo !== 'novel')
                    .map(({ slug, titulo }) => new Manga(this, provider, slug, titulo));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { capitulos } = await FetchJSON<APIChapters>(new Request(new URL(`./series/${manga.Identifier}`, this.apiURL)));
        return capitulos.map(({ slug, numero }) => new Chapter(this, manga, slug, `${numero}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const { data: { paginas } } = await FetchJSON<APIPages>(new Request(new URL(`./series/${chapter.Parent.Identifier}/capitulos/${chapter.Identifier}`, this.apiURL)));
        return paginas.map(({ url, sc }) => {
            const uri = new URL(url);
            if (uri.hostname.endsWith('r2.cloudflarestorage.com')) uri.hostname = 'cdn.nexusscanlation.com';
            return new Page<PageParameters>(this, chapter, uri, { Seed: sc?.s, Columns: sc?.c, Rows: sc?.r });
        });
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await FetchImageAjax.call(this, page, priority, signal);
        const { Seed, Columns, Rows } = page.Parameters;
        return Columns && Rows && Seed ? DeScramble(blob, async (image, ctx) => {

            const tileWidth = Math.floor(image.width / Columns);
            const tileHeight = Math.floor(image.height / Rows);
            const totalTiles = Columns * Rows;

            ctx.canvas.width = tileWidth * Columns;
            ctx.canvas.height = tileHeight * Rows;

            const shuffledPositions = new PRNG(Seed).Sequence(totalTiles);

            for (let tileIndex = 0; tileIndex < totalTiles; tileIndex++) {
                const destinationIndex = shuffledPositions[tileIndex];
                const sourceX = tileIndex % Columns * tileWidth;
                const sourceY = Math.floor(tileIndex / Columns) * tileHeight;
                const destX = destinationIndex % Columns * tileWidth;
                const destY = Math.floor(destinationIndex / Columns) * tileHeight;
                ctx.drawImage(image, sourceX, sourceY, tileWidth, tileHeight, destX, destY, tileWidth, tileHeight);
            }
        }) : blob;
    }
}