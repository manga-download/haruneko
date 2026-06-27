import { Tags } from '../Tags';
import icon from './PhiliaScans.webp';
import type { Priority } from '../taskpool/DeferredTask';
import { Fetch, FetchJSON } from '../platform/FetchProvider';
import { GetHexFromBytes, GetBytesFromHex, GetBytesFromBase64, GetBytesFromUTF8 } from '../BufferEncoder';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import DeScramble from '../transformers/ImageDescrambler';
import { GetTypedData } from './decorators/Common';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';

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
    chapter: {
        pages: {
            url: string;
        }[];
        scrambled: boolean;
    };
};

type APIToken = {
    token: string;
};

type APIPageKeys = {
    chapterKeyB64: string;
    gridSize: number;
    sessionDefault: boolean;
};

type APIOpenResponse = {
    sessionId: string;
    payloadA: string;
};

type APIDrmResponse = {
    payloadB: string;
};

type PageParameters = {
    PageIndex: number;
    IsScrambled: boolean;
    GridSize: number;
    KeyData: string;
};

type ChapterID = {
    slug: string;
    id: string;
};

// TODO: Major Code Revision
class PRNG {

    private nCounter = 0;
    private rBuf = new Uint8Array(0);
    private aIndex = 8;
    private readonly mac: Promise<CryptoKey>;

    constructor(signKey: CryptoKey, pageIndex: number) {
        this.mac = crypto.subtle.sign('HMAC', signKey, GetBytesFromUTF8(`tiles:${pageIndex}`))
            .then(tilesSig => crypto.subtle.importKey('raw', tilesSig, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']));
    }

    private async NextRandom(): Promise<number> {
        if (this.aIndex >= 8) {
            this.rBuf = new Uint8Array(await crypto.subtle.sign('HMAC', await this.mac, GetBytesFromUTF8(`perm:${this.nCounter++}`)));
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

export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/`;

    public constructor() {
        super('philiascans', 'Philia Scans', 'https://philiascans.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/series/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { slug, title } = await this.FetchAPI<APIManga>(`./manga/${url.split('/').at(-1)}`);
        return new Manga(this, provider, slug, title);
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
        return items.map(({ id, slug, title, number }) => new Chapter(this, manga, JSON.stringify({ slug, id: `${id}` }), [`Ch.${number}`, title].joinTitleSegments()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const { id: chapterId, slug: chapterSlug } = <ChapterID>JSON.parse(chapter.Identifier);
        const { chapter: { pages, scrambled } } = await this.FetchAPI<APIPages>(`./manga/${chapter.Parent.Identifier}/chapters/${chapterSlug}`);

        if (pages.length === 0) {
            throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }

        const { chapterKeyB64, gridSize, sessionDefault } = await this.FetchAPI<APIPageKeys>(`./chapters/${chapterId}/page-keys`);
        let keyData: Uint8Array<ArrayBuffer> = GetBytesFromBase64(chapterKeyB64);

        if (sessionDefault) {
            const token = (await this.FetchAPI<APIToken>(`./reader/access-token`, undefined, 'POST')).token;
            const { payloadA, sessionId } = await this.FetchAPI<APIOpenResponse>(`./chapters/${chapterId}/open`, token, 'POST');
            const { payloadB } = await this.FetchAPI<APIDrmResponse>(`./chapters/${chapterId}/get-drm?session=${sessionId}`, token);
            if (payloadA && payloadB) keyData = new Uint8Array(this.XOR(GetBytesFromBase64(payloadA), GetBytesFromBase64(payloadB)));
        }

        return pages.map(({ url }, index) => new Page<PageParameters>(this, chapter, new URL(url, this.URI), {
            PageIndex: index,
            IsScrambled: scrambled,
            GridSize: gridSize,
            KeyData: GetHexFromBytes(keyData),
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
        const buffer = await (await this.imageTaskPool.Add(() => Fetch(new Request(page.Link, { headers: { Referer: this.URI.href } })), priority, signal)).arrayBuffer();
        if ( !page.Link.href.includes('_s-sm.webp') && !page.Link.href.includes('_s.webp')) return GetTypedData(buffer);

        const { PageIndex, IsScrambled, GridSize, KeyData } = page.Parameters;
        const signKey = await crypto.subtle.importKey('raw', GetBytesFromHex(KeyData), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);

        const encryptionType = this.GetEncryptionType(buffer);
        const encrypted = new Uint8Array(buffer, encryptionType === 'AESV3' || 'AESV4' || 'CHACHA20' ? 6 : 4);

        const blob = await this.DecryptImage(encrypted, encryptionType, signKey, PageIndex);
        if (encryptionType === 'CHACHA20' || encryptionType === 'AESV4') return blob;

        return !IsScrambled ? blob : DeScramble(blob, async (image, ctx) => {
            const tileWidth = image.width / GridSize;
            const tileHeight = image.height / GridSize;
            const tileCount = GridSize * GridSize;

            const indexes = new PRNG(signKey, PageIndex).Next(GridSize);

            for (let tileIndex = 0; tileIndex < tileCount; tileIndex++) {
                const srcIdx = indexes[tileIndex];

                const srcX = srcIdx % GridSize * tileWidth;
                const srcY = Math.floor(srcIdx / GridSize) * tileHeight;

                const dstX = tileIndex % GridSize * tileWidth;
                const dstY = Math.floor(tileIndex / GridSize) * tileHeight;

                ctx.drawImage(image, srcX, srcY, tileWidth, tileHeight, dstX, dstY, tileWidth, tileHeight);
            }
        });
    }

    private GetEncryptionType(buffer: ArrayBuffer): string {
        const patterns = [
            { type: 'AESV3', sig: [0xff, 0x2] },
            { type: 'AESV4', sig: [0xff, 0x4] },
            { type: 'CHACHA20', sig: [0xff, 0x3] },
        ];
        const view = new Uint8Array(buffer, 0, 2);
        return patterns.find(({ sig }) => view.length >= sig.length && sig.every((b, i) => view[i] === b))?.type ?? 'XOR';
    }

    private async DecryptImage(encrypted: Uint8Array<ArrayBuffer>, encryptionType: string, signKey: CryptoKey, pageIndex: number): Promise<Blob> {
        let imageData: ArrayBuffer;
        switch (encryptionType) {
            case 'AESV3':
            case 'AESV4': {
                imageData = await this.AESDecrypt(signKey, pageIndex, encrypted, encryptionType === 'AESV3' ? 'aesctr' : 'aesctr4');
                break;
            }
            case 'CHACHA20': {
                imageData = (await this.Chacha20Decrypt(signKey, pageIndex, encrypted)).buffer;
                break;
            }
            case 'XOR': {
                imageData = this.XOR(await this.ComputeXorKey(signKey, pageIndex, encrypted.byteLength), encrypted).buffer;
                break;
            }
        }
        return GetTypedData(imageData);
    }

    // XOR
    private XOR(source: Uint8Array, key: Uint8Array): Uint8Array<ArrayBuffer> {
        return source.map((byte, index) => byte ^ key[index]);
    }

    private async ComputeXorKey(key: CryptoKey, pageIndex: number, length: number): Promise<Uint8Array<ArrayBuffer>> {
        const numBlocks = Math.ceil(length / 32);
        const result = new Uint8Array(32 * numBlocks);

        for (let r = 0; r < numBlocks; r++) {
            const data = GetBytesFromUTF8(`page:${pageIndex}:${r}`);
            const sign = await crypto.subtle.sign({ name: 'HMAC', hash: 'SHA-256' }, key, data);
            result.set(new Uint8Array(sign), 32 * r);
        }
        return result.subarray(0, length);
    }

    // AES
    private async AESDecrypt(signKey: CryptoKey, pageIndex: number, data: Uint8Array<ArrayBuffer>, prefix: string): Promise<ArrayBuffer> {
        const keyData = new Uint8Array(await crypto.subtle.sign({ name: 'HMAC', hash: 'SHA-256' }, signKey, GetBytesFromUTF8(`${prefix}:${pageIndex}`)));
        const key = await crypto.subtle.importKey('raw', keyData, { name: 'AES-CTR' }, false, ['decrypt']);
        return crypto.subtle.decrypt({
            name: 'AES-CTR',
            counter: new Uint8Array(16),
            length: 128
        }, key, data);
    }

    // CHACHA20
    private async Chacha20Decrypt(signKey: CryptoKey, pageIndex: number, data: Uint8Array<ArrayBuffer>, counter: number = 0) {
        function Rotl32(x: number, n: number): number {
            return (x << n | x >>> 32 - n) >>> 0;
        }

        function BytesToUint32ArrayLE(bytes: Uint8Array): Uint32Array {
            const len = bytes.length >>> 2;
            const out = new Uint32Array(len);
            const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

            for (let i = 0; i < len; i++) {
                out[i] = view.getUint32(i * 4, true);
            }
            return out;
        }

        function QuarterRound(state: Uint32Array, a: number, b: number, c: number, d: number): void {
            state[a] = state[a] + state[b] >>> 0;
            state[d] = Rotl32(state[d] ^ state[a], 16);

            state[c] = state[c] + state[d] >>> 0;
            state[b] = Rotl32(state[b] ^ state[c], 12);

            state[a] = state[a] + state[b] >>> 0;
            state[d] = Rotl32(state[d] ^ state[a], 8);

            state[c] = state[c] + state[d] >>> 0;
            state[b] = Rotl32(state[b] ^ state[c], 7);
        }

        const key = new Uint8Array(await crypto.subtle.sign({ name: 'HMAC', hash: 'SHA-256' }, signKey, GetBytesFromUTF8(`cc:${pageIndex}`)));
        const keyWords = BytesToUint32ArrayLE(key);
        const nonceWords = BytesToUint32ArrayLE(new Uint8Array(12));
        const out = new Uint8Array(data);
        const state = new Uint32Array(16);

        state[0] = 0x61707865;
        state[1] = 0x3320646e;
        state[2] = 0x79622d32;
        state[3] = 0x6b206574;
        state.set(keyWords.subarray(0, 8), 4);
        let blockCounter = counter >>> 0;
        state[12] = blockCounter;
        state[13] = nonceWords[0];
        state[14] = nonceWords[1];
        state[15] = nonceWords[2];

        const working = new Uint32Array(16);

        for (let offset = 0; offset < data.length; offset += 64) {
            state[12] = blockCounter;
            blockCounter = blockCounter + 1 >>> 0;
            working.set(state);
            for (let i = 0; i < 10; i++) {
                QuarterRound(working, 0, 4, 8, 12);
                QuarterRound(working, 1, 5, 9, 13);
                QuarterRound(working, 2, 6, 10, 14);
                QuarterRound(working, 3, 7, 11, 15);
                QuarterRound(working, 0, 5, 10, 15);
                QuarterRound(working, 1, 6, 11, 12);
                QuarterRound(working, 2, 7, 8, 13);
                QuarterRound(working, 3, 4, 9, 14);
            }

            for (let i = 0; i < 16; i++) {
                working[i] = working[i] + state[i] >>> 0;
            }

            const blockLen = Math.min(64, data.length - offset);

            for (let i = 0; i < blockLen; i++) {
                out[offset + i] ^= working[i >>> 2] >>> ((i & 3) << 3) & 0xff;
            }
        }
        return out;
    }
}