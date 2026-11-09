import { Tags } from '../Tags';
import icon from './Dilar.webp';
import { Chapter, DecoratableMangaScraper, Page, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import { FetchJSON } from '../platform/FetchProvider';
import * as Common from './decorators/Common';
import { Delay } from '../BackgroundTimers';
import { GetBytesFromURLBase64, GetBytesFromUTF8, GetURLBase64FromBytes, GetUTF8FromBytes } from '../BufferEncoder';
import type { Priority } from '../taskpool/DeferredTask';

type APIMangas = {
    series: APIManga[];
};

type APIManga = {
    id: string;
    title: string;
    chapters: APIChapter[];
};

type APIChapter = {
    chapter: string;
    releases: {
        id: string;
        teams: {
            name: string;
        }[];
    }[];
};

type ChapterToken = {
    token: string;
};

type EncryptedResult = {
    v: number; // encryption version
    e: number; // extra parameter
    epk: string; // ephemeral public key from server
    iv: string; // initialization vecvtor
    ct: string; // ciphertext
    tag: string; // tag (for AES-GCM)
};

type APIPages = {
    pages: APIPage[];
    webp_pages: APIPage[];
    storage_key: string;
    media_token: string;
    //scheme: TScheme;
};

/*
type TScheme = {
    id: number; // fixed to 2for now
    params: {
        algo: number // fixed to 1 for now
        seed: string; //64 bytes hex string
        dir: string; //string matching   /^hq_s2\/[0-9a-f]{8,64}$/;
        fallbackDir: string; //^[a-z0-9_]{1,16}$/
        storageKey: string;
        //skipGrant: boolean;
    };
};
*/

type APIPage = {
    url: string;
    //dir?: string; //fallback for 'hq'
    s2?: ScrambleParameters
};

type ScrambleParameters = {
    c: number; // columns
    r: number; // rows
    tw: number; // width
    th: number; // height
};

/*
type BufferPointer = {
    value: number;
    cursor: number;
};

class PRNG {
    private seedHex: string;
    private keyPromise: Promise<CryptoKey> | null = null;
    private orders: Map<string, Promise<number[] | null>> = new Map();

    constructor(seed: string) {
        this.seedHex = seed;
    }

    public ToJSON(): string {
        return '[scheme2-key]';
    }

    public ToString(): string {
        return '[scheme2-key]';
    }

    public ImportKey(): Promise<CryptoKey> {
        if (!this.keyPromise) {
            this.keyPromise = crypto.subtle.importKey('raw', GetBytesFromHex(this.seedHex), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
        }
        return this.keyPromise;
    }

    public Sequence(filename: string, params: ScrambleParameters): Promise<number[] | null> {
        const cacheKey = `${filename}|${params.c}x${params.r}`;
        const cachedPromise = this.orders.get(cacheKey);

        if (cachedPromise) return cachedPromise;

        const orderPromise = this.DeriveOrder(filename, params).catch(() => {
            this.orders.delete(cacheKey);
            return null;
        });

        this.orders.set(cacheKey, orderPromise);
        return orderPromise;
    }

    async #GenerateHMACBlocks(key: CryptoKey, baseString: string, startIndex: number, count: number): Promise<number[] | null> {
        const signPromises = Array.from({ length: count }, (_, index) =>
            crypto.subtle.sign(
                'HMAC',
                key,
                GetBytesFromUTF8(`${baseString}|${startIndex + index}`)
            )
        );

        const signatures = await Promise.all(signPromises);
        const uint32List: number[] = [];

        for (const sig of signatures) {
            const dataView = new DataView(sig);
            for (let offset = 0; offset + 4 <= sig.byteLength; offset += 4) {
                uint32List.push(dataView.getUint32(offset, false));
            }
        }

        return uint32List;
    }

    private async DeriveOrder(filename: string, params: ScrambleParameters): Promise<number[] | null> {
        const { c: cols, r: rows } = params;
        const totalTiles = cols * rows;
        const cryptoKey = await this.ImportKey();

        const baseString = `dilar/s2/perm/v1|${filename}|${cols}x${rows}`;
        let blocksNeeded = Math.ceil((totalTiles + 8) / 8);
        let hmacValues = await this.#GenerateHMACBlocks(cryptoKey, baseString, 0, blocksNeeded);

        if (!hmacValues) return null;

        const permutation = Array.from({ length: totalTiles }, (_, index) => index);
        let cursor = 0;

        // Fisher-Yates shuffle using unbiased values
        for (let i = totalTiles - 1; i > 0; i--) {
            let sample = this.#GetUnbiasedValue(hmacValues, cursor, i + 1);

            if (sample.value < 0) {
                const extraBlocks = await this.#GenerateHMACBlocks(cryptoKey, baseString, blocksNeeded, 4);
                if (!extraBlocks) return null;

                hmacValues = hmacValues.concat(extraBlocks);
                blocksNeeded += 4;

                sample = this.#GetUnbiasedValue(hmacValues, cursor, i + 1);
                if (sample.value < 0) return null;
            }

            cursor = sample.cursor;
            const targetIndex = sample.value;

            // Swap elements
            const temp = permutation[i];
            permutation[i] = permutation[targetIndex];
            permutation[targetIndex] = temp;
        }

        return permutation;
    }

    #GetUnbiasedValue(buffer: number[] | Uint32Array, cursor: number, limit: number): BufferPointer {
        if (limit <= 1) return { value: 0, cursor };

        const maxValid = Math.floor(4294967296 / limit) * limit;
        let currentCursor = cursor;
        let attempts = 0;

        while (currentCursor < buffer.length && buffer[currentCursor] >= maxValid && attempts < 64) {
            currentCursor += 1;
            attempts += 1;
        }

        if (currentCursor >= buffer.length) {
            return { value: -1, cursor: currentCursor };
        }

        return {
            value: buffer[currentCursor] % limit,
            cursor: currentCursor + 1
        };
    }
}
*/
class DRMProvider {

    private CURVE_NAME = 'P-256';
    private ecKeyPair: Promise<CryptoKeyPair>;
    private clientPublicKeyBytes: Promise<Uint8Array<ArrayBuffer>>;

    constructor() {
        this.ecKeyPair = window.crypto.subtle.generateKey({ name: 'ECDH', namedCurve: this.CURVE_NAME, }, true, ['deriveKey', 'deriveBits']);
        this.clientPublicKeyBytes = this.ecKeyPair.then(async (keyPair) => {
            return new Uint8Array(await window.crypto.subtle.exportKey('raw', keyPair.publicKey));
        });
    }

    /**
     * Retrieves the base64url-encoded raw client public key to send to the server.
     */
    public async GetClientPubB64(): Promise<string> {
        return GetURLBase64FromBytes(await this.clientPublicKeyBytes);
    }

    /**
     * Decrypts the incoming ECIES response payload.
     */
    public async Decrypt<T extends JSONElement>(data: EncryptedResult): Promise<T> {

        const { e: extraParameter, v: version, ct: cipherText, epk, iv, tag } = data;
        const { privateKey } = await this.ecKeyPair;
        const initializationVector = GetBytesFromURLBase64(iv);
        const ephemeralKeyBytes = GetBytesFromURLBase64(epk);

        const importedPeerKey = await crypto.subtle.importKey('raw', ephemeralKeyBytes, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
        const sharedSecretBits = await crypto.subtle.deriveBits({ name: 'ECDH', public: importedPeerKey }, privateKey, 256);

        let infoString = `dilar.response.ecies.v${version}|${extraParameter}`;
        let salt: Uint8Array<ArrayBuffer> = undefined;

        switch (version) {
            case 1: {
                salt = this.ConcatBuffers(await this.clientPublicKeyBytes, ephemeralKeyBytes);
                break;
            }
            case 2: {
                salt = this.ConcatBuffers(ephemeralKeyBytes, await this.clientPublicKeyBytes);
                break;
            }
            case 3: {
                salt = new Uint8Array(await crypto.subtle.digest('SHA-256', this.ConcatBuffers(ephemeralKeyBytes, await this.clientPublicKeyBytes)));
                break;
            }
            case 4: {
                salt = new Uint8Array(await crypto.subtle.digest('SHA-256', this.ConcatBuffers(await this.clientPublicKeyBytes, ephemeralKeyBytes, initializationVector)));
                infoString += `|${iv}`;
                break;
            }
            default: {
                throw new Error(`Unknown API decryption version : ${version} !`, );
            }
        };

        const importedSecretKey = await crypto.subtle.importKey('raw', sharedSecretBits, 'HKDF', false, ['deriveKey']);
        const decryptionKey = await crypto.subtle.deriveKey(
            {
                name: 'HKDF',
                hash: 'SHA-256',
                salt,
                info: GetBytesFromUTF8(infoString)
            },
            importedSecretKey,
            { name: 'AES-GCM', length: 256 }, false, ['decrypt']);

        const combinedCiphertextAndTag = this.ConcatBuffers(GetBytesFromURLBase64(cipherText), GetBytesFromURLBase64(tag));
        const decryptedBuffer = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: initializationVector }, decryptionKey, combinedCiphertextAndTag);
        return <T>JSON.parse(GetUTF8FromBytes(decryptedBuffer));

    }

    // --- Helper Utilities (No Node Buffer dependency) ---

    private ConcatBuffers(...arrays: Uint8Array[]): Uint8Array<ArrayBuffer> {
        const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const arr of arrays) {
            result.set(arr, offset);
            offset += arr.length;
        }
        return result;
    }
}
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://dilar.tube/api/';
    #drm: DRMProvider = undefined;

    public constructor() {
        super('dilar', `Dilar`, 'https://dilar.tube', Tags.Language.Arabic, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        super.Initialize();
        this.#drm = new DRMProvider();
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/series/\\d+/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { id, title } = await this.FetchAPI<APIManga>(`./series/${url.split('/').at(-2)}`);
        return new Manga(this, provider, id, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                await Delay(500);
                const { series } = await this.FetchAPI<APIMangas>(`./series/?page=${page}`);
                const mangas = !series ? [] : series.map(({ id, title }) => new Manga(this, provider, id, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await this.FetchAPI<APIManga>(`./series/${manga.Identifier}/chapters`);
        return chapters.reduce((accumulator: Chapter[], entry) => {
            const chapters = entry.releases.map(({ id, teams }) => new Chapter(this, manga, id, `${entry.chapter} [${teams.at(0).name}]`));
            accumulator.push(...chapters);
            return accumulator;
        }, []);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<ScrambleParameters>[]> {
        const chapterUrl = new URL(`./chapters/${chapter.Identifier}`, this.apiURL);
        const { token } = await this.FetchAPI<ChapterToken>(`${chapterUrl.href}/unlock/free`, JSON.stringify({}));

        const response = await this.FetchAPI<EncryptedResult>(chapterUrl.href, undefined, { 'X-Unlock-Free-Chapter': token });
        const { pages, storage_key, media_token } = await this.#drm.Decrypt<APIPages>(response);
        return pages.map(({ url, s2 }) => new Page<ScrambleParameters>(this, chapter, new URL(`/uploads/releases/${storage_key}/hq/${url}?t=${encodeURIComponent(media_token)}`, this.URI), { ...s2 }));
    }

    public async FetchImage(page: Page<ScrambleParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        if (page.Parameters.c) throw new Error('Unscrambling no supported, please contact us !');
        return Common.FetchImageAjax.call(this, page, priority, signal);
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string, body: string = undefined, parameters: Record<string, string> = undefined): Promise<T> {
        const request = new Request(new URL(endpoint, this.apiURL), {
            method: body ? 'POST' : 'GET',
            body
        });
        if (parameters) Object.entries(parameters).forEach(([name, value]) => request.headers.set(name, value));
        request.headers.set('X-DH-Pub', await this.#drm.GetClientPubB64());
        return FetchJSON<T>(request);
    }
}