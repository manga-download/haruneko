import { Tags } from '../Tags';
import icon from './NexusScans.webp';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import type { Priority } from '../taskpool/DeferredTask';
import { FetchImageAjax } from './decorators/Common';
import DeScramble from '../transformers/ImageDescrambler';

type APIMangas = {
    data: APIManga[];
};

type APIManga = {
    slug: string;
    tipo: string;
    titulo: string;
};

type APIMangaDetails = {
    serie: APIManga;
    capitulos: APIChapter[];
};

type APIChapter = {
    numero: number;
    slug: string;
};

type ScrambleParameters = {
    c: number; //columns
    r: number; //rows
    s: number; //seed
};

type APIPages = {
    data: {
        paginas: {
            url: string;
            sc?: ScrambleParameters;
        }[];
    };
};

export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://api.nexusscanlation.com/api/v1/';
    private readonly CDN = 'https://cdn.nexusscanlation.com';

    public constructor() {
        super('nexusscans', 'Nexus Scans', 'https://nexusscanlation.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Scanlator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `localStorage.setItem('nexus-age-filter', 'all')`);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/series/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { serie: { slug, titulo } } = await FetchJSON<APIMangaDetails>(new Request(new URL(`./series/${url.split('/').at(-1)}`, this.apiUrl)));
        return new Manga(this, provider, slug, titulo);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data } = await FetchJSON<APIMangas>(new Request(new URL(`./catalog?page=${page}&limit=50`, this.apiUrl)));
                const mangas = data
                    .filter(({ tipo }) => tipo != 'novel')
                    .map(({ slug, titulo }) => new Manga(this, provider, slug, titulo));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { capitulos } = await FetchJSON<APIMangaDetails>(new Request(new URL(`./series/${manga.Identifier}`, this.apiUrl)));
        return capitulos.map(({ slug, numero }) => new Chapter(this, manga, slug, `${numero}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<ScrambleParameters>[]> {
        const { data: { paginas } } = await FetchJSON<APIPages>(new Request(new URL(`./series/${chapter.Parent.Identifier}/capitulos/${chapter.Identifier}`, this.apiUrl)));
        return paginas.map(({ url, sc }) => {
            const uri = new URL(url);
            return new Page<ScrambleParameters>(this, chapter, uri.hostname.endsWith('r2.cloudflarestorage.com') ? new URL(uri.pathname, this.CDN) : uri, { ...sc });
        });
    }

    public override async FetchImage(page: Page<ScrambleParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await FetchImageAjax.call(this, page, priority, signal);
        const { c: columns, r: rows, s: seed } = page.Parameters;
        return !columns || !rows || !seed ? blob : DeScramble(blob, async (image, ctx) => {
            function createShuffledIndices(count: number, seed: number): number[] {
                const indices = Array.from({ length: count }, (_, i) => i);
                const random = createSeededRandom(seed);
                for (let i = count - 1; i > 0; i--) {
                    const j = Math.floor(random() * (i + 1));
                    [indices[i], indices[j]] = [indices[j], indices[i]];
                }
                return indices;
            }

            function createSeededRandom(seed: number): () => number {
                let state = seed >>> 0;
                return function () {
                    state |= 0;
                    let result = Math.imul((state = state + 1831565813 | 0) ^ state >>> 15, 1 | state);
                    result = result + Math.imul(result ^ result >>> 7, 61 | result) ^ result;
                    return ((result ^ result >>> 14) >>> 0) / 4294967296;
                };
            }

            const tileWidth = Math.floor(image.width / columns);
            const tileHeight = Math.floor(image.height / rows);
            const totalTiles = columns * rows;

            ctx.canvas.width = tileWidth * columns;
            ctx.canvas.height = tileHeight * rows;

            const shuffledPositions = createShuffledIndices(totalTiles, seed);

            for (let tileIndex = 0; tileIndex < totalTiles; tileIndex++) {
                const destinationIndex = shuffledPositions[tileIndex];
                const sourceX = tileIndex % columns * tileWidth;
                const sourceY = Math.floor(tileIndex / columns) * tileHeight;
                const destX = destinationIndex % columns * tileWidth;
                const destY = Math.floor(destinationIndex / columns) * tileHeight;
                ctx.drawImage(image, sourceX, sourceY, tileWidth, tileHeight, destX, destY, tileWidth, tileHeight);
            }
        });
    }

}