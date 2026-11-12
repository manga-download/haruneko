import { FetchRedirection } from '../../platform/AntiScrapingDetection';
import { FetchJSON, FetchWindowScript } from '../../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../../providers/MangaPlugin';
import DeScramble from '../../transformers/ImageDescrambler';

export type APIManga = {
    id: number;
    nombre: string;
    slug: string;
    capitulos: APIChapter[];
}

type APIMangas = {
    data: APIManga[];
};

export type APIChapter = {
    id: number;
    numero: number;
    titulo: string;
};

type ImageSlice = {
    sx: number;
    sy: number;
    sw: number;
    sh: number;
    dx: number;
    dy: number;
    dw: number;
    dh: number;
};

type ReaderToken = {
    pass: string;
    expiresAt: number;
};

export function CaptchaScript(readerPassName: string): string {
    return `
        new Promise((resolve) => {
            function isValidPassInStorage() {
                try {
                    const element = sessionStorage.getItem('${readerPassName}');
                    const readerPass = JSON.parse(element);
                    return readerPass.expiresAt > Date.now();
                } catch {
                    return false;
                }
            };

            if (isValidPassInStorage()) {
                resolve(${FetchRedirection.None});
                return;
            }

            document.addEventListener('solve', async (event) => {
                setTimeout(() => window.location.reload(), 500);
                resolve(${FetchRedirection.Automatic});
                return;
            });

            resolve(${FetchRedirection.Interactive});
        });
    `;
};

class CatharsisPNG {
    private state: number;

    /**
     * Initializes the PRNG with a seed string or number.
     */
    constructor(seed: string) {
        this.state = this.#HashSeed(seed.toString());
    }

    /**
     * Hashes a string into a signed 32-bit integer state.
     */
    #HashSeed(seedString: string): number {
        let seed = 0;
        for (let i = 0; i < seedString.length; i++) {
            seed = Math.imul(31, seed) + seedString.charCodeAt(i) | 0;
        }
        return seed;
    }

    /**
     * Generates a pseudo-random floating-point number in [0, 1) using Mulberry32.
     */
    public Next(): number {
        this.state = this.state + 0x6d2b79f5 | 0;
        let t = Math.imul(this.state ^ this.state >>> 15, this.state | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }

    /**
     * Generates visual slices by partitioning dimensions with jitter
     * and applying Fisher-Yates permutations to coordinates.
     */
    public Sequence(width: number, height: number, cols: number = 8, rows: number = 8): ImageSlice[] {
        // --- Step 1: Partition Width (X-axis) ---
        const X = new Array<number>(cols + 1);
        X[0] = 0;
        X[cols] = width;

        const avgColWidth = Math.floor(width / cols);
        let accumulatedX = 0;
        const minWidth = 16;

        for (let i = 1; i < cols; i++) {
            const jitter = Math.round((this.Next() * 0.7 - 0.35) * avgColWidth);
            let colWidth = avgColWidth + jitter;

            const remainingCols = cols - i;
            const maxAllowedWidth = width - accumulatedX - remainingCols * minWidth;

            colWidth = Math.max(minWidth, colWidth);
            colWidth = Math.min(colWidth, Math.max(minWidth, maxAllowedWidth));

            accumulatedX += colWidth;
            X[i] = accumulatedX;
        }

        // --- Step 2: Partition Height (Y-axis) ---
        const Y = new Array<number>(rows + 1);
        Y[0] = 0;
        Y[rows] = height;

        const avgRowHeight = Math.floor(height / rows);
        let accumulatedY = 0;
        const minHeight = 16;

        for (let i = 1; i < rows; i++) {
            const jitter = Math.round((this.Next() * 0.7 - 0.35) * avgRowHeight);
            let rowHeight = avgRowHeight + jitter;

            const remainingRows = rows - i;
            const maxAllowedHeight = height - accumulatedY - remainingRows * minHeight;

            rowHeight = Math.max(minHeight, rowHeight);
            rowHeight = Math.min(rowHeight, Math.max(minHeight, maxAllowedHeight));

            accumulatedY += rowHeight;
            Y[i] = accumulatedY;
        }

        // --- Step 3: Create Fisher-Yates Permutations ---
        const colPerm = Array.from({ length: cols }, (_, i) => i);
        for (let i = cols - 1; i > 0; i--) {
            const j = Math.floor(this.Next() * (i + 1));
            [colPerm[i], colPerm[j]] = [colPerm[j], colPerm[i]];
        }

        const rowPerm = Array.from({ length: rows }, (_, i) => i);
        for (let i = rows - 1; i > 0; i--) {
            const j = Math.floor(this.Next() * (i + 1));
            [rowPerm[i], rowPerm[j]] = [rowPerm[j], rowPerm[i]];
        }

        // --- Step 4: Compute Source Offset Positions ---
        const srcX = new Array<number>(cols + 1);
        srcX[0] = 0;
        for (let i = 0; i < cols; i++) {
            const origIndex = colPerm[i];
            const sliceWidth = X[origIndex + 1] - X[origIndex];
            srcX[i + 1] = srcX[i] + sliceWidth;
        }

        const srcY = new Array<number>(rows + 1);
        srcY[0] = 0;
        for (let i = 0; i < rows; i++) {
            const origIndex = rowPerm[i];
            const sliceHeight = Y[origIndex + 1] - Y[origIndex];
            srcY[i + 1] = srcY[i] + sliceHeight;
        }

        const inverseColPerm = new Array<number>(cols);
        for (let i = 0; i < cols; i++) inverseColPerm[colPerm[i]] = i;

        const inverseRowPerm = new Array<number>(rows);
        for (let i = 0; i < rows; i++) inverseRowPerm[rowPerm[i]] = i;

        // --- Step 5: Build Image Slice Remapping Instructions ---
        const slices: ImageSlice[] = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const destX = X[c];
                const destY = Y[r];
                const sliceWidth = X[c + 1] - X[c];
                const sliceHeight = Y[r + 1] - Y[r];

                const permutedCol = inverseColPerm[c];
                const permutedRow = inverseRowPerm[r];

                const sourceX = srcX[permutedCol];
                const sourceY = srcY[permutedRow];

                slices.push({ sx: sourceX, sy: sourceY, sw: sliceWidth, sh: sliceHeight, dx: destX, dy: destY, dw: sliceWidth, dh: sliceHeight });
            }
        }
        return slices;
    }
}

export async function CatharsisDeScramble(blob: Blob, scrambleKey: string){
    return DeScramble(blob, async (image, ctx) => {
        if (image.width >= 200 && image.height >= 200) {
            const tileGrid = new CatharsisPNG(scrambleKey).Sequence(image.width, image.height, 8, 8); // Slice image into grid tiles
            ctx.imageSmoothingEnabled = false;

            for (const tile of tileGrid) {
                ctx.drawImage(image, tile.sx, tile.sy, tile.sw, tile.sh, tile.dx, tile.dy, tile.dw, tile.dh);
            }

            ctx.imageSmoothingEnabled = true;
        } else {
            ctx.drawImage(image, 0, 0);
        }
    });
}

export class CatharsisBase extends DecoratableMangaScraper {

    protected apiURL = `${this.URI.origin}/api/`;
    private websiteHeaders : Record<string, string> = undefined;
    protected mangaPath = `/manga/`;
    protected readerToken: ReaderToken = undefined;
    private readerPassName: string;

    public WithReaderPassName(name: string) {
        this.readerPassName = name;
        return this;
    }

    public WithAPIUrl(url: string) {
        this.apiURL = url;
        return this;
    }

    public WithMangaPath(path: string) {
        this.mangaPath = path;
        return this;
    }

    public WithWebsiteHeaders(headers: Record<string, string>) {
        this.websiteHeaders = headers;
        return this;
    }

    protected async RenewReaderToken(url: string): Promise<void> {
        //const [, mangaSlug] = chapter.Parent.Identifier.split('/');
        //const [, chapterNumber] = chapter.Identifier.split('/');

        if (!this.readerToken || this.readerToken.expiresAt < Date.now()) {
            this.readerToken = await FetchWindowScript<ReaderToken>(new Request(new URL(url)), `JSON.parse(sessionStorage.getItem('${this.readerPassName}'));`, 2500);
        }
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}${this.mangaPath}[^/]+$`).test(url);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data } = await this.FetchAPI<APIMangas>(`./mangas?limit=500&page=${page}`);
                const mangas = data.map(({ id, nombre, slug }) => new Manga(this, provider, `${id}/${slug}`, nombre));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const [mangaID] = manga.Identifier.split('/');
        const { capitulos } = await this.FetchAPI<APIManga>(`./mangas/${mangaID}`);
        return capitulos.map(({ id, numero, titulo }) => new Chapter(this, manga, `${id}/${numero}`, titulo));
    }

    protected async FetchAPI<T extends JSONElement>(endpoint: string, body: JSONElement = undefined, headers: Record<string, string> = undefined): Promise<T> {
        const method = body ? 'POST' : 'GET';
        const request = new Request(new URL(endpoint, this.apiURL), {
            method,
            headers: {
                //...this.#authToken && { 'Authorization': `Bearer ${this.#authToken}` },
                Referer: this.URI.href,
                Origin: this.URI.origin,
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                ...this.websiteHeaders,
                ...headers
            }, body: JSON.stringify(body),
        });
        //Object.entries(this.websiteHeaders).forEach(([name, value]) => request.headers.set(name, value));
        //if (headers) Object.entries(headers).forEach(([name, value]) => request.headers.set(name, value));
        return FetchJSON<T>(request);
    }
}
