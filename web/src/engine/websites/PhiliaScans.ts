import { Tags } from '../Tags';
import icon from './PhiliaScans.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { Fetch, FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import { GetBytesFromBase64, GetBytesFromUTF8 } from '../BufferEncoder';
import * as Common from './decorators/Common';
import DeScramble from '../transformers/ImageDescrambler';
import { GetTypedData } from './decorators/Common';

type APIResult<T> = {
    items: T[];
};

type APIManga = {
    slug: string;
    title: string;
};

type APIMangas = APIResult<APIManga>;

type APIChapter = {
    id: number;
    number: string;
    title: string;
    slug: string;
    pages: {
        url: string;
    }[];
    scrambled: boolean;
};

type APIChapters = APIResult<APIChapter>;

type APIPages = {
    chapter: APIChapter;
};

type APIToken = {
    token: string;
};

type APIPageKeys = {
    chapterKeyB64: string;
    gridSize: number;
};

type APIOpenResponse = {
    sessionId: string;
    payloadA: string;
};

type APIDrmResponse = {
    payloadB: string;
};

type PageParameters = {
    pageIndex: number;
    scrambled: boolean;
    chapterKeyB64: string;
    gridSize: number;
    payloadA: string;
    payloadB: string;
};

class TilePermutation {
    private nCounter = 0;
    private rBuf = new Uint8Array(0);
    private aIndex = 8;
    private mac!: CryptoKey;

    constructor(
        private readonly signKey: CryptoKey,
        private readonly pageIndex: number
    ) { }

    async Init() {
        const tilesSig = await crypto.subtle.sign('HMAC', this.signKey, GetBytesFromUTF8(`tiles:${this.pageIndex}`));
        this.mac = await crypto.subtle.importKey('raw', tilesSig, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    }

    private async NextRandom(): Promise<number> {
        if (this.aIndex >= 8) {
            this.rBuf = new Uint8Array(await crypto.subtle.sign('HMAC', this.mac, GetBytesFromUTF8(`perm:${this.nCounter++}`)));
            this.aIndex = 0;
        }
        const offset = this.aIndex * 4;
        const value =
            this.rBuf[offset] |
            this.rBuf[offset + 1] << 8 |
            this.rBuf[offset + 2] << 16 |
            this.rBuf[offset + 3] << 24;
        this.aIndex++;
        return value >>> 0;
    }

    /**
     * Returns the inverse permutation
     */
    async Next(gridSize: number): Promise<number[]> {
        this.nCounter = 0;
        this.rBuf = new Uint8Array(0);
        this.aIndex = 8;

        const gridSizeSq = gridSize * gridSize;
        const c = Array.from({ length: gridSizeSq }, (_, i) => i);

        for (let idx = gridSizeSq - 1; idx >= 1; idx--) {
            const swapIdx = await this.NextRandom() % (idx + 1);
            [c[idx], c[swapIdx]] = [c[swapIdx], c[idx]];
        }

        const indexes = new Array<number>(gridSizeSq);

        for (let i = 0; i < gridSizeSq; i++) {
            indexes[c[i]] = i;
        }
        return indexes;
    }
}

@Common.MangaCSS<HTMLImageElement>(/^{origin}\/series\/[^/]+$/, 'div.detail-cover img', (img, uri) => ({
    id: uri.pathname.split('/').at(-1),
    title: img.alt.trim()
}))
export default class extends DecoratableMangaScraper {
    private readonly apiURL = `${this.URI.origin}/api/`;

    public constructor() {
        super('philiascans', 'Philia Scans', 'https://philiascans.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { items } = await this.FetchAPI<APIMangas>(`./manga?perPage=60&page=${page}`);
                const mangas = items.map(({ slug, title }) => new Manga(this, provider, slug, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { items } = await this.FetchAPI<APIChapters>(`./manga/${manga.Identifier}/chapters`);
        return items.map(({ slug, title, number }) => new Chapter(this, manga, slug, [`Ch.${number}`, title].joinTitleSegments()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const { chapter: { id, pages, scrambled } } = await this.FetchAPI<APIPages>(`./manga/${chapter.Parent.Identifier}/chapters/${chapter.Identifier}`);

        const token = (await this.FetchAPI<APIToken>(`./reader/access-token`, undefined, 'POST')).token;
        const { chapterKeyB64, gridSize } = await this.FetchAPI<APIPageKeys>(`./chapters/${id}/page-keys`, token);
        const { payloadA, sessionId } = await this.FetchAPI<APIOpenResponse>(`./chapters/${id}/open`, token, 'POST');
        const { payloadB } = await this.FetchAPI<APIDrmResponse>(`./chapters/${id}/get-drm?session=${sessionId}`, token);

        return pages.map(({ url }, index) => new Page<PageParameters>(this, chapter, new URL(url, this.URI), {
            pageIndex: index, scrambled, chapterKeyB64, payloadA, payloadB, gridSize
        }));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string, token: string = undefined, method = 'GET'): Promise<T> {
        return FetchJSON<T>(new Request(new URL(endpoint, this.apiURL), {
            method,
            headers: {
                ...token && { 'X-Reader-Access-Token': token }
            }
        }));
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const buffer = await (await this.imageTaskPool.Add(() => Fetch(new Request(page.Link, { headers: { Referer: this.URI.href} })), priority, signal)).arrayBuffer();

        const { chapterKeyB64, payloadA, payloadB, pageIndex, scrambled, gridSize } = page.Parameters;
        const chapterKey = payloadA && payloadB ? this.XOR(GetBytesFromBase64(payloadA), GetBytesFromBase64(payloadB)) : GetBytesFromBase64(chapterKeyB64);

        const signKey = await crypto.subtle.importKey('raw', chapterKey, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);

        const header = new Uint8Array(buffer, 0, 2);
        const isAES = header[0] === 255 && header[1] === 2;
        const headerSize = isAES ? 6 : 4;

        //const view = new DataView(buffer, isAES ? 2 : 0, 4);
        //const originalWidth = view.getUint16(0, false);
        //const originalHeight = view.getUint16(2, false);

        const encryptedBytes = new Uint8Array(buffer, headerSize);
        const imageData = isAES ? await this.AESDecrypt(signKey, pageIndex, encryptedBytes) :
            this.XOR(await this.DeriveKeystream(signKey, pageIndex, encryptedBytes.byteLength), encryptedBytes);

        const blob = await GetTypedData(imageData);
        return !scrambled ? blob : DeScramble(blob, async (image, ctx) => {
            const tileWidth = image.width / gridSize;
            const tileHeight = image.height / gridSize;
            const gridSizeSq = gridSize * gridSize;

            const perm = new TilePermutation(signKey, pageIndex);
            await perm.Init();

            const indexes = await perm.Next(gridSize);

            for (let t = 0; t < gridSizeSq; t++) {
                const srcIdx = indexes[t];

                const srcX = srcIdx % gridSize * tileWidth;
                const srcY = Math.floor(srcIdx / gridSize) * tileHeight;

                const dstX = t % gridSize * tileWidth;
                const dstY = Math.floor(t / gridSize) * tileHeight;

                ctx.drawImage(image, srcX, srcY, tileWidth, tileHeight, dstX, dstY, tileWidth, tileHeight);
            }
        });
    }

    private async DeriveKeystream(key: CryptoKey, pageIndex: number, length: number): Promise<Uint8Array<ArrayBuffer>> {
        const numBlocks = Math.ceil(length / 32);
        const result = new Uint8Array(32 * numBlocks);

        for (let r = 0; r < numBlocks; r++) {
            const data = GetBytesFromUTF8(`page:${pageIndex}:${r}`);
            const sign = await crypto.subtle.sign({ name: 'HMAC', hash: 'SHA-256' }, key, data);
            result.set(new Uint8Array(sign), 32 * r);
        }
        return result.subarray(0, length);
    }

    private async AESDecrypt(signKey: CryptoKey, pageIndex: number, data: Uint8Array): Promise<ArrayBuffer> {
        const aeskeyData = new Uint8Array(await crypto.subtle.sign({ name: 'HMAC', hash: 'SHA-256' }, signKey, GetBytesFromUTF8(`aesctr:${pageIndex}`)));
        const aesKey = await crypto.subtle.importKey('raw', aeskeyData, { name: 'AES-CTR' }, false, ['decrypt']);
        return crypto.subtle.decrypt({
            name: 'AES-CTR',
            counter: new Uint8Array(16),
            length: 128
        }, aesKey, new Uint8Array(data));
    }

    private XOR(source: Uint8Array, key: Uint8Array): ArrayBuffer {
        return source.map((byte, index) => byte ^ key[index]).buffer;
    }
}
