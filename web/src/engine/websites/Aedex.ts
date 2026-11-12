import icon from './CatharsisWorld.webp';
import { Tags } from '../Tags';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchJSON, FetchWindowScript, FetchNextJS, FetchHTML } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import { XOR } from '../Crypto';
import DeScramble from '../transformers/ImageDescrambler';
import { AddAntiScrapingDetection, FetchRedirection } from '../platform/AntiScrapingDetection';
import { GetBytesFromUTF8, GetURLBase64FromBytes } from '../BufferEncoder';

AddAntiScrapingDetection(async invoke => invoke(`
    new Promise((resolve) => {
        function isValidPassInStorage() {
            try {
                const element = sessionStorage.getItem('aedex_reader_pass');
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

`), /^https:\/\/aedexnox\.com\/comic\/[^/]+\/\d+/);

type HydratedManga = {
    info: {
        id: number;
        nombre: string;
        slug: string;
        capitulos: APIChapter[];
    };
};

type APIManga = {
    id: number;
    nombre: string;
    slug: string;
    capitulos: APIChapter[];
}

type APIMangas = {
    data: APIManga[];
};

type APIChapter = {
    id: number;
    numero: number;
    titulo: string;
};

type ReaderToken = {
    pass: string;
    expiresAt: number;
};

type GateAnswer = {
    //in case websocket validation is required
    ws_required?: boolean;
    ws_url?: string;
    ws_ticket?: string;

    wait_seconds?: number;

    //redirection (ie POST redirect_data to redirect_url )
    redirect_required?: boolean;
    redirect_url?: string;
    redirect_data?: string;

    //pages are directly available (either via computing, either via paginas array)
    chapterSessionToken?: string;
    totalPaginas?: number;
    //paginas?: PageData[]; ??????
};

type WebSocketMessage = {
    type: 'countdown' | 'ready';
    remainingSeconds?: number;
    totalSeconds?: number;
    challenge?: string;
    redirect_url?: string;
    redirect_data?: string;
};

type WebSocketValidationResult = {
    redirect_url: string;
    redirect_data: string;
};

type PageData = {
    index: number;
    scrambleKey?: string;
    chapterSessionToken?: string;
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

class PRNG {
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

export class ECCManager {
    private keyPairPromise: Promise<CryptoKeyPair>;

    constructor() {
        this.keyPairPromise = crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
    }

    public async GetPubKey(): Promise<string> {
        const { publicKey } = await this.keyPairPromise;
        const exportedKey = await crypto.subtle.exportKey("spki", publicKey);
        return GetURLBase64FromBytes(new Uint8Array(exportedKey));
    }

    public async Sign(message: string): Promise<string> {
        const { privateKey } = await this.keyPairPromise;

        const buffer = GetBytesFromUTF8(message);
        const signature = await crypto.subtle.sign({ name: "ECDSA", hash: { name: "SHA-256" } }, privateKey, buffer);
        return GetURLBase64FromBytes(new Uint8Array(signature));
    }
}

export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/`;
    #authToken: string = undefined;
    #readerToken: ReaderToken = undefined;

    public constructor() {
        super('aedex', 'Aedex', 'https://aedexnox.com', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
        //this.imageTaskPool.RateLimit = new RateLimit(1, 2);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/comic/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { info: { id, nombre, slug } } = await FetchNextJS<HydratedManga>(new Request(new URL(url)), data => 'info' in data);
        return new Manga(this, provider, `${id}/${slug}`, nombre);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data } = await this.FetchAPI<APIMangas>(`./backend/mangas?limit=500&page=${page}`);
                const mangas = data.map(({ id, nombre, slug }) => new Manga(this, provider, `${id}/${slug}`, nombre));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const [mangaID] = manga.Identifier.split('/');
        const { capitulos } = await this.FetchAPI<APIManga>(`./backend/mangas/${mangaID}`);
        return capitulos.map(({ id, numero, titulo }) => new Chapter(this, manga, `${id}/${numero}`, titulo));
    }

    private async RenewReaderToken(chapter: Chapter): Promise<void> {
        const [, mangaSlug] = chapter.Parent.Identifier.split('/');
        const [, chapterNumber] = chapter.Identifier.split('/');

        if (!this.#readerToken || this.#readerToken.expiresAt < Date.now()) {
            this.#readerToken = await FetchWindowScript<ReaderToken>(new Request(new URL(`/comic/${mangaSlug}/${chapterNumber}?modo=gratis`, this.URI)), `JSON.parse(sessionStorage.getItem('aedex_reader_pass'));`, 2500);
        }
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageData>[]> {
        await this.RenewReaderToken(chapter);
        const [, mangaSlug] = chapter.Parent.Identifier.split('/');
        const [, chapterNumber] = chapter.Identifier.split('/');

        const signer = new ECCManager();
        const gateAnswer = await this.FetchAPI<GateAnswer>(`./backend/mangas/${mangaSlug}/${chapterNumber}?modo=gratis`, undefined, {
            'X-Catharsis-Reader-Pass': this.#readerToken.pass,
            'X-Catharsis-WS-Pub': await signer.GetPubKey()
        });

        //TODO : handle direct pages
        const { chapterSessionToken } = gateAnswer;
        if (chapterSessionToken) return [];

        //HANDLE Websocket validation
        const { ws_required: wsRequired, ws_url: wsUrl, ws_ticket: wsTicket } = gateAnswer;
        let { redirect_url: redirectUrl, redirect_data: redirectData } = gateAnswer;

        if (wsRequired && wsUrl && wsTicket) {
            const answer = await this.WebSocketValidation(wsUrl, wsTicket, signer);
            redirectUrl = answer?.redirect_url;
            redirectData = answer?.redirect_data;
        };

        //Redirection
        const formData = new FormData();
        formData.append('data', redirectData);

        const realUrl = new URL(redirectUrl);
        const html = await FetchHTML(new Request(realUrl, {
            method: 'POST',
            body: formData
        }));

        //Extract pages from HTML
        const elements = [...html.querySelectorAll<HTMLCanvasElement>('canvas.manga-page-canvas')];
        return elements.map(({ dataset }, index) => new Page<PageData>(this, chapter, new URL(dataset.src), { Referer: realUrl.href, index, scrambleKey: dataset.k }));
    }

    private async WebSocketValidation(wsUrl: string, wsTicket: string, signer: ECCManager): Promise<WebSocketValidationResult> {
        return new Promise(async (resolve, reject) => {
            const WS = new WebSocket(`${wsUrl}?ticket=${wsTicket}`);
            try {
                WS.onerror = (error) => {
                    WS.close();
                    reject(error);
                };
                WS.onmessage = async (event: MessageEvent<WebSocketMessage>) => {
                    const { type, remainingSeconds, challenge, redirect_url: redirectUrl, redirect_data: redirectData } = <WebSocketMessage>JSON.parse(String(event.data));

                    switch (type) {
                        case 'countdown': {
                            console.log(`WebSocket countdown: ${remainingSeconds} seconds remaining.`);
                            const sig = await signer.Sign(challenge);
                            WS.readyState === WebSocket.OPEN && WS.send(JSON.stringify({ type: 'ack', challenge, sig }));
                            break;
                        };
                        case 'ready': {
                            console.log(`READY`);
                            WS.close();
                            resolve({ redirect_url: redirectUrl, redirect_data: redirectData });
                        };

                    }
                };
            } catch (error) {
                WS.close();
                reject(error);
            }
        });
    }

    public override async FetchImage(page: Page<PageData>, priority: Priority, signal: AbortSignal): Promise<Blob> {

        const decryptPicture = (buffer: ArrayBuffer, key: number) => Common.GetTypedData(XOR(new Uint8Array(buffer), new Uint8Array([key])).buffer);

        const buffer = await this.imageTaskPool.Add(async () => {
            return (await Fetch(new Request(page.Link, {
                headers: {
                    Referer: page.Parameters.Referer,
                    'Sec-Fetch-Dest': 'empty',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'same-origin',
                },
            }))).arrayBuffer();
        }, priority, signal);

        //Decrypt image if needed, with either key 175 or key 43
        let blob = await Common.GetTypedData(buffer);
        if (!blob.type.startsWith('image/')) blob = await decryptPicture(buffer, 175);
        if (!blob.type.startsWith('image/')) blob = await decryptPicture(buffer, 43);

        return DeScramble(blob, async (image, ctx) => {
            if (image.width >= 200 && image.height >= 200) {
                const tileGrid = new PRNG(page.Parameters.scrambleKey).Sequence(image.width, image.height, 8, 8); // Slice image into grid tiles
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
        const request = new Request(new URL(endpoint, this.apiURL), {
            method,
            headers: {
                ...this.#authToken && { 'Authorization': `Bearer ${this.#authToken}` },
                Referer: this.URI.href,
                Origin: this.URI.origin,
                'Content-Type': 'application/json',
                'System': 'aexdex',
                'X-Fk-Sistema': '1',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
            }, body: JSON.stringify(body),
        });
        if (headers) Object.entries(headers).forEach(([name, value]) => request.headers.set(name, value));
        return FetchJSON<T>(request);
    }
}