import icon from './CatharsisWorld.webp';
import { Tags } from '../Tags';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchJSON } from '../platform/FetchProvider';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';
import type { Priority } from '../taskpool/DeferredTask';
import { GetBytesFromUTF8, GetHexFromBytes } from '../BufferEncoder';
import { DecryptXOR } from '../Crypto';
import DeScramble from '../transformers/ImageDescrambler';

type APIMangas = {
    data: APIManga[];
};

type APIManga = {
    id: number;
    nombre: string;
    capitulos: APIChapter[];
};

type APIChapter = {
    id: number;
    titulo: string;
    paginas: {
        index: number;
    }[];
    chapterSessionToken: string;
};

type PageData = {
    index: number;
    chapterSessionToken: string;
};

type SignedHeaders = {
    timestamp: string;
    nonce: string;
    sig: string;
};

type TicketResponse = {
    signedToken: string;
    scrambleKey: string;
    xorByte: number;
};

type ImageSlice ={
    sx: number;
    sy: number;
    sw: number;
    sh: number;
    dx: number;
    dy: number;
    dw: number;
    dh: number;
}

/*
type GridPartitionResult = {
    cols: number;
    rows: number;
    X: number[];
    Y: number[];
    colPerm: number[];
    rowPerm: number[];
    slices: ImageSlice[];
}*/

export class PRNG {
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

export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/`;

    public constructor() {
        super('catharsisworld', 'Catharsis World', 'https://newcatharsis.dig-it.info', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { id, nombre } = await this.FetchAPI<APIManga>(`./mangas/${url.split('/').at(-1)}`);
        return new Manga(this, provider, `${id}`, nombre);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data } = await this.FetchAPI<APIMangas>(`./mangas?limit=500&page=${page}`);
                const mangas = data.map(({ id, nombre }) => new Manga(this, provider, `${id}`, nombre));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { capitulos } = await this.FetchAPI<APIManga>(`./mangas/${manga.Identifier}`);
        return capitulos.map(({ id, titulo }) => new Chapter(this, manga, `${id}`, titulo));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageData>[]> {
        const { paginas, chapterSessionToken } = await this.FetchAPI<APIChapter>(`./mangas/${chapter.Parent.Identifier}/${chapter.Identifier}`);
        if (!paginas) {
            throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }
        return paginas.map(({ index }) => new Page<PageData>(this, chapter, new URL(this.URI), { index, chapterSessionToken }));
    }

    public override async FetchImage(page: Page<PageData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        //get page ticket https://newcatharsis.dig-it.info/api/mangas/chapters/chapterID/page-ticket
        const { scrambleKey, signedToken, xorByte } = await this.FetchAPI<TicketResponse>(`./mangas/chapters/${page.Parent.Identifier}/page-ticket`, {
            pageIndex: page.Parameters.index,
            sessionToken: page.Parameters.chapterSessionToken
        });

        //fetch actual page
        const { nonce, sig, timestamp } = await this.GenerateSignatureHeaders();

        const buffer = await this.imageTaskPool.Add(async () => {
            return (await Fetch(new Request(new URL(`./mangas/pages/${signedToken}`, this.apiURL), {
                headers: {
                    Referer: page.Parameters.Referer,
                    'Sec-Fetch-Site': 'same-origin',
                    'X-Catharsis-Reader': '1',
                    'x-catharsis-nonce': nonce,
                    'x-catharsis-sig': sig,
                    'x-catharsis-time': timestamp,
                    'X-Fk-Sistema': '3'
                },
            }))).arrayBuffer();
        }, priority, signal);

        const blob = await Common.GetTypedData(DecryptXOR(new Uint8Array(buffer), new Uint8Array([xorByte])).buffer);

        return DeScramble(blob, async (image, ctx) => {
            if (image.width >= 200 && image.height >= 200) {
                const tileGrid = new PRNG(scrambleKey).Sequence(image.width, image.height, 8, 8); // Slice image into grid tiles
                ctx.imageSmoothingEnabled = false;

                // Draw scrambled tiles onto canvas in mapped order
                for (const tile of tileGrid) {
                    ctx.drawImage(image, tile.sx, tile.sy, tile.sw, tile.sh, tile.dx, tile.dy, tile.dw, tile.dh);
                }

                ctx.imageSmoothingEnabled = true;
            } else {
                // Standard full image render (draws image at 0, 0)
                ctx.drawImage(image, 0, 0);
            }
        });
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string, body: JSONElement = undefined, headers: Record<string, string> = undefined): Promise<T> {
        const method = body ? 'POST' : 'GET';
        const { nonce, sig, timestamp } = await this.GenerateSignatureHeaders(method);
        const request = new Request(new URL(endpoint, this.apiURL), {
            method,
            headers: {
                Referer: this.URI.href,
                Origin: this.URI.origin,
                'Content-Type': 'application/json',
                'System': 'catharsis',
                'x-catharsis-nonce': nonce,
                'x-catharsis-sig': sig,
                'x-catharsis-time': timestamp,
                'X-Fk-Sistema': '3'
            }, body: JSON.stringify(body),
        });
        if (headers) Object.entries(headers).forEach(([name, value]) => request.headers.set(name, value));
        return FetchJSON<T>(request);
    }

    private async GenerateSignatureHeaders(method: string = 'GET'): Promise<SignedHeaders> {
        const magic = '4$^£]C8j%La3';
        const timestamp = `${Date.now()}`;
        const nonce = Math.random().toString(36).substring(2, 10);
        const sig = await this.HMAC256(GetBytesFromUTF8(magic), GetBytesFromUTF8(`${timestamp}:${nonce}:${method}`));
        return {
            timestamp,
            nonce,
            sig: GetHexFromBytes(sig),
        };
    }

    private async HMAC256(keyData: Uint8Array<ArrayBuffer>, messageData: Uint8Array<ArrayBuffer>): Promise<Uint8Array<ArrayBuffer>> {
        const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
        const signature = await crypto.subtle.sign('HMAC', key, messageData);
        return new Uint8Array(signature);
    }
}