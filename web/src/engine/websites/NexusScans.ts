import { Tags } from '../Tags';
import icon from './NexusScans.webp';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import type { Priority } from '../taskpool/DeferredTask';
import { FetchImageAjax, GetTypedData } from './decorators/Common';
import DeScramble from '../transformers/ImageDescrambler';
import { GetBytesFromURLBase64, GetBytesFromUTF8, GetURLBase64FromBytes, GetUTF8FromBytes } from '../BufferEncoder';

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
            orden: number;
            url: string;
            sc?: {
                s: number;
                c: number;
                r: number;
                v?: number;
            };
            e?: boolean;
        }[];
        r?: string;
        id: string;
    };
};

type DecryptedChapterData = {
    k: Record<string, string>;
    s: Record<string, number>;
}

type PageParameters = {
    Seed?: number;
    Columns?: number;
    Rows?: number;
    Version?: number;
    Encrypted: boolean;
    PageIndex: number;
}

class DRMProvider {

    private CURVE_NAME = 'P-256';
    private ecKeyPair: Promise<CryptoKeyPair>;
    private info = GetBytesFromUTF8('nexus:lector:v1');
    private chapterKeys: Map<string, Map<number, CryptoKey>> = new Map();
    constructor() {
        this.ecKeyPair = crypto.subtle.generateKey({ name: 'ECDH', namedCurve: this.CURVE_NAME, }, true, ['deriveBits']);
    }

    public async GetPublicKeyB64() {//export public key in base64 format
        const e = (await this.ecKeyPair).publicKey;
        return GetURLBase64FromBytes(new Uint8Array(await crypto.subtle.exportKey('raw', e)));
    }

    private async ImportHKDF(e: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
        return crypto.subtle.importKey('raw', e, 'HKDF', !1, [
            'deriveBits',
            'deriveKey'
        ]);
    };

    public async DecryptChapterData(chapterId: string, data: string): Promise<Record<string, number>> {
        const privateKey = (await this.ecKeyPair).privateKey;
        const { k, s } = <DecryptedChapterData>JSON.parse(GetUTF8FromBytes(await this.Decrypt(privateKey, data)));
        const pageKeys = new Map<number, CryptoKey>();

        for (let [key, value] of Object.entries(k ?? {})) {
            pageKeys.set(Number(key), await this.ImportHKDF(GetBytesFromURLBase64(value)));
        }

        this.chapterKeys.delete(chapterId);
        this.chapterKeys.set(chapterId, pageKeys);
        if (this.chapterKeys.size > 4) {
            this.chapterKeys.delete(this.chapterKeys.keys().next().value);
        }
        return s ?? {};
    }

    private async Decrypt(privateKey: CryptoKey, data: string): Promise<Uint8Array<ArrayBuffer>> {
        const buffer = GetBytesFromURLBase64(data);
        const importedKey = await crypto.subtle.importKey('raw', buffer.slice(0, 65),
            { name: 'ECDH', namedCurve: 'P-256' }, false, []);
        const derivedBits = await crypto.subtle.deriveBits(
            { name: 'ECDH', public: importedKey }, privateKey, 256);
        const hkdfKey = await crypto.subtle.importKey('raw', derivedBits, 'HKDF', false, ['deriveKey']);
        const derivedKey = await crypto.subtle.deriveKey({
            name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(0), info: this.info
        }, hkdfKey, { name: 'AES-GCM', length: 128 }, false, ['decrypt']);
        return new Uint8Array(
            await crypto.subtle.decrypt({ name: 'AES-GCM', iv: buffer.slice(65, 77) }, derivedKey, buffer.slice(77))
        );
    }

    public async DecryptPage(blob: Blob, chapterId: string, pageIndex: number): Promise<Blob> {
        const key = this.chapterKeys.get(chapterId)?.get(pageIndex);
        if (!key) return blob;
        const data = await this.DecryptRfc8188(key, await blob.arrayBuffer());
        return GetTypedData(data.buffer);
    }

    /**
     * Decrypts an RFC 8188 encrypted payload(HTTP Encryption).
     */
    private async DecryptRfc8188(baseKey: CryptoKey, ciphertext: ArrayBuffer): Promise<Uint8Array<ArrayBuffer>> {
        const r = GetBytesFromUTF8('Content-Encoding: aes128gcm\x00');
        const a = GetBytesFromUTF8('Content-Encoding: nonce\x00');

        const buffer = new Uint8Array(ciphertext);

        // 1. Validate minimum header length (salt: 16 bytes, record size: 4 bytes, id len: 1 byte = 21 bytes minimum)
        if (buffer.length < 21) {
            throw new Error('rfc8188: body too short');
        }

        const salt = buffer.subarray(0, 16);
        const dataView = new DataView(ciphertext);
        const recordSize = dataView.getUint32(16);
        const idLength = buffer[20];
        const headerLength = 21 + idLength;

        if (recordSize < 18 || buffer.length < headerLength) {
            throw new Error('rfc8188: bad header');
        }

        // Helper to generate HKDF parameters
        const getHkdfParams = (info) => ({
            name: 'HKDF',
            hash: 'SHA-256',
            salt: salt,
            info: info
        });

        // 2. Derive the AES-GCM content encryption key and the base initialization vector (IV) in parallel
        // Note: 'r' and 'a' represent the info parameters defined by RFC 8188 for key and IV derivation.
        const [encryptionKey, baseIv] = await Promise.all([
            crypto.subtle.deriveKey(
                getHkdfParams(r),
                baseKey,
                { name: 'AES-GCM', length: 128 },
                false,
                ['decrypt']
            ),
            crypto.subtle.deriveBits(getHkdfParams(a), baseKey, 96).then(bits => new Uint8Array(bits))
        ]);

        // 3. Decrypt each individual record chunk
        const decryptionPromises = [];
        for (let offset = headerLength, recordSequence = 0; offset < buffer.length; offset += recordSize, recordSequence++) {
            // Clone the base IV and XOR the sequence number into the last 4 bytes
            const currentIv = baseIv.slice();
            const ivDataView = new DataView(currentIv.buffer);
            ivDataView.setUint32(8, ivDataView.getUint32(8) ^ recordSequence >>> 0);

            const chunk = buffer.subarray(offset, Math.min(offset + recordSize, buffer.length));

            decryptionPromises.push(
                crypto.subtle.decrypt({ name: 'AES-GCM', iv: currentIv }, encryptionKey, chunk)
            );
        }

        const decryptedChunks = (await Promise.all(decryptionPromises)).map(chunk => new Uint8Array(chunk));

        // 4. Remove padding and validate record delimiters
        let totalPlaintextLength = 0;
        const processedChunks = decryptedChunks.map((chunk, index) => {
            let paddingIndex = chunk.length - 1;

            // Find the end of the padding
            while (paddingIndex >= 0 && chunk[paddingIndex] === 0) {
                paddingIndex--;
            }

            const isLastRecord = index === decryptedChunks.length - 1;
            const expectedDelimiter = isLastRecord ? 2 : 1;

            if (paddingIndex < 0 || chunk[paddingIndex] !== expectedDelimiter) {
                throw new Error('rfc8188: bad record delimiter');
            }

            totalPlaintextLength += paddingIndex;
            return chunk.subarray(0, paddingIndex);
        });

        // 5. Combine all decrypted chunks into a single final buffer
        const finalPlaintext = new Uint8Array(totalPlaintextLength);
        let writeOffset = 0;
        for (const chunk of processedChunks) {
            finalPlaintext.set(chunk, writeOffset);
            writeOffset += chunk.length;
        }
        return finalPlaintext;
    }
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

    /**
    * Generate an Int32Array of random flip values (0 to 3) for tile descrambling.
    */
    public Flips(count: number): Int32Array {
        const flips = new Int32Array(count);
        for (let i = 0; i < count; i++) {
            flips[i] = Math.floor(this.#Next() * 4);
        }
        return flips;
    }
}

export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://api.nexusscanlation.com/api/v1/';
    private readonly drmProvider = new DRMProvider();

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
        return new RegExpSafe(`^${this.URI.origin}/[^/]+/comics/[^/]+$`).test(url);
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
        const { data: { paginas, id, r } } = await FetchJSON<APIPages>(new Request(new URL(`./series/${chapter.Parent.Identifier}/capitulos/${chapter.Identifier}`, this.apiURL), {
            headers: {
                'x-Rs': await this.drmProvider.GetPublicKeyB64() //public ecc key
            }
        }));

        if (r) {
            const seedData = await this.drmProvider.DecryptChapterData(id, r);
            paginas.forEach(page => {
                if (page.sc) {
                    page.sc.s = seedData[String(page.orden)] ?? 0;
                }
            });
        }
        return paginas.map(({ url, sc, e, orden }) => {
            const uri = new URL(url);
            if (uri.hostname.endsWith('r2.cloudflarestorage.com')) uri.hostname = 'cdn.nexusscanlation.com';
            return new Page<PageParameters>(this, chapter, uri, { Seed: sc?.s, Columns: sc?.c, Rows: sc?.r, Version: sc?.v, Encrypted: !!e, PageIndex: orden });
        });
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        let blob = await FetchImageAjax.call(this, page, priority, signal);
        const { Seed, Columns, Rows, Version, Encrypted, PageIndex } = page.Parameters;

        if (Encrypted) {
            blob = await this.drmProvider.DecryptPage(blob, page.Parent.Identifier, PageIndex);
        }

        return Columns && Rows && Seed ? DeScramble(blob, async (image, ctx) => {

            const tileWidth = Math.floor(image.width / Columns);
            const tileHeight = Math.floor(image.height / Rows);
            const totalTiles = Columns * Rows;

            ctx.canvas.width = tileWidth * Columns;
            ctx.canvas.height = tileHeight * Rows;

            const rng = new PRNG(Seed);
            const shuffledPositions = rng.Sequence(totalTiles);
            const flips: Int32Array | null = Version >= 2 ? rng.Flips(totalTiles) : null;

            for (let srcIndex = 0; srcIndex < totalTiles; srcIndex++) {
                const srcX = srcIndex % Columns * tileWidth;
                const srcY = Math.floor(srcIndex / Columns) * tileHeight;
                const dstIndex = shuffledPositions[srcIndex];
                const dstX = dstIndex % Columns * tileWidth;
                const dstY = Math.floor(dstIndex / Columns) * tileHeight;
                const flip = flips ? flips[srcIndex] : 0;

                ctx.save();
                if (flip === 0) {
                    ctx.drawImage(image, srcX, srcY, tileWidth, tileHeight, dstX, dstY, tileWidth, tileHeight);
                } else {
                    const flipH = (flip & 1) !== 0;
                    const flipV = (flip & 2) !== 0;
                    const transX = flipH ? dstX + tileWidth : dstX;
                    const transY = flipV ? dstY + tileHeight : dstY;
                    const scaleX = flipH ? -1 : 1;
                    const scaleY = flipV ? -1 : 1;

                    ctx.translate(transX, transY);
                    ctx.scale(scaleX, scaleY);
                    ctx.drawImage(image, srcX, srcY, tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);
                }
                ctx.restore();
            }
        }) : blob;
    }
}