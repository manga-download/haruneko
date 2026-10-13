import { Tags } from '../Tags';
import icon from './Dilar.webp';
import { Chapter, DecoratableMangaScraper, Page, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import { FetchJSON } from '../platform/FetchProvider';
import * as Common from './decorators/Common';
import { Delay } from '../BackgroundTimers';
import { GetBytesFromURLBase64, GetBytesFromUTF8, GetHexFromBytes, GetURLBase64FromBytes, GetUTF8FromBytes } from '../BufferEncoder';
import type { Priority } from '../taskpool/DeferredTask';
import { chacha20Poly1305Decrypt } from '../Crypto';

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

type EncryptionScheme = {
    salt: Uint8Array<ArrayBuffer>;
    infoString: string;
    hash: string;
    deriveNonce: Boolean;
    aad?: Uint8Array<ArrayBuffer>;
    chacha: Boolean;
    gcmsiv: Boolean;
    aessiv: Boolean;
    keyBytes: number;
}

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

    private ToBigEndian16(n: number): Uint8Array {
        return new Uint8Array([n >> 8 & 0xFF, n & 0xFF]);
    }

    private LengthPrefixed(bytes: Uint8Array<ArrayBuffer>): Uint8Array<ArrayBuffer> {
        return this.ConcatBuffers(this.ToBigEndian16(bytes.length), bytes);
    }

    private ToBigEndian32(n: number): Uint8Array {
        return new Uint8Array([
            n >>> 24 & 0xff,
            n >>> 16 & 0xff,
            n >>> 8 & 0xff,
            n & 0xff
        ]);
    }

    private async SHA(message: Uint8Array<ArrayBuffer>, algorithm: string = 'SHA-256'): Promise<Uint8Array<ArrayBuffer>> {
        return new Uint8Array(await crypto.subtle.digest(algorithm, message));
    }

    private async HMAC(keyBytes: Uint8Array<ArrayBuffer>, dataBytes: Uint8Array<ArrayBuffer>, algorithm: string = 'SHA-256'): Promise<Uint8Array<ArrayBuffer>> {
        const cryptoKey = await window.crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: { name: algorithm } }, false, ['sign']);
        const signature = await window.crypto.subtle.sign('HMAC', cryptoKey, dataBytes);
        return new Uint8Array(signature);
    }

    private async HKDF(ikm: Uint8Array<ArrayBuffer>, salt: Uint8Array<ArrayBuffer>, info: Uint8Array<ArrayBuffer>, length: number, algorithm: string = 'SHA-256'): Promise<Uint8Array<ArrayBuffer>> {
        const keyMaterial = await window.crypto.subtle.importKey('raw', ikm, { name: 'HKDF' }, false, ['deriveBits']);
        const derivedBits = await window.crypto.subtle.deriveBits(
            {
                name: 'HKDF',
                hash: algorithm,
                salt: salt,
                info: info,
            } as HkdfParams,
            keyMaterial,
            length * 8
        );

        return new Uint8Array(derivedBits);
    }

    // BufferSourceFromUint8 omitted to preserve original typings and avoid SharedArrayBuffer issues.

    private async AAD(label: string, versionNumber: number, extraData: number, serverPubRaw: Uint8Array<ArrayBuffer>, iv: Uint8Array<ArrayBuffer>, ctSize: number): Promise<Uint8Array<ArrayBuffer>> {

        const labelBytes = GetBytesFromUTF8(label);
        const version = GetBytesFromUTF8(String(versionNumber));
        const e = GetBytesFromUTF8(String(extraData));
        const size = this.ToBigEndian32(ctSize);

        const combinedBytes = this.ConcatBuffers(
            this.ToBigEndian16(labelBytes.length),
            labelBytes,
            this.ToBigEndian16(version.length),
            version,
            this.ToBigEndian16(e.length),
            e,
            this.ToBigEndian16(serverPubRaw.length),
            serverPubRaw,
            this.ToBigEndian16(iv.length),
            iv,
            this.ToBigEndian16(size.length),
            size
        );

        return await this.SHA(combinedBytes);
    }

    private async ClientKeyedSalt(serverPubRaw: Uint8Array<ArrayBuffer>, iv: Uint8Array<ArrayBuffer>): Promise<Uint8Array<ArrayBuffer>> {
        return await this.HMAC(await this.clientPublicKeyBytes, this.ConcatBuffers(
            this.ToBigEndian16(serverPubRaw.length),
            serverPubRaw,
            this.ToBigEndian16(iv.length),
            iv
        ), 'SHA-512');
    }

    private async ServerKeyedSalt(serverPubRaw: Uint8Array<ArrayBuffer>, iv: Uint8Array<ArrayBuffer>): Promise<Uint8Array<ArrayBuffer>> {
        const clientPub = await this.clientPublicKeyBytes;
        return await this.HMAC(serverPubRaw, this.ConcatBuffers(
            this.ToBigEndian16(clientPub.length),
            clientPub,
            this.ToBigEndian16(iv.length),
            iv
        ), 'SHA-512');
    }

    private async IvKeyedSalt(serverPubRaw: Uint8Array<ArrayBuffer>, iv: Uint8Array<ArrayBuffer>): Promise<Uint8Array<ArrayBuffer>> {
        const clientPub = await this.clientPublicKeyBytes;
        return await this.HMAC(iv, this.ConcatBuffers(
            this.ToBigEndian16(clientPub.length),
            clientPub,
            this.ToBigEndian16(serverPubRaw.length),
            serverPubRaw
        ), 'SHA-512');
    }

    /**
     * Decrypts the incoming ECIES response payload.
     */
    public async Decrypt<T extends JSONElement>(data: EncryptedResult): Promise<T> {

        const { e: extraParameter, v: version, ct: cipherText, epk, iv, tag } = data;
        const { privateKey } = await this.ecKeyPair;

        const clientPublicBytes = await this.clientPublicKeyBytes;
        const initializationVector = GetBytesFromURLBase64(iv);
        const ephemeralKeyBytes = GetBytesFromURLBase64(epk);

        const importedPeerKey = await crypto.subtle.importKey('raw', ephemeralKeyBytes, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
        const sharedSecretBits = await crypto.subtle.deriveBits({ name: 'ECDH', public: importedPeerKey }, privateKey, 256);

        const scheme: EncryptionScheme = {
            hash: 'SHA-256',
            deriveNonce: false,
            salt: undefined,
            infoString: `dilar.response.ecies.v${version}|${extraParameter}`,
            chacha: false,
            gcmsiv: false,
            aessiv: false,
            keyBytes: 32
        };

        switch (version) {
            case 1: {
                scheme.salt = this.ConcatBuffers(clientPublicBytes, ephemeralKeyBytes);
                break;
            }
            case 2: {
                scheme.salt = this.ConcatBuffers(ephemeralKeyBytes, clientPublicBytes);
                break;
            }
            case 3: {
                scheme.salt = await this.SHA(this.ConcatBuffers(ephemeralKeyBytes, clientPublicBytes));
                break;
            }
            case 4: {
                scheme.salt = await this.SHA(this.ConcatBuffers(clientPublicBytes, ephemeralKeyBytes, initializationVector));
                scheme.infoString += `|${iv}`;
                break;
            }
            case 5: {
                scheme.salt = await this.HMAC(initializationVector, this.ConcatBuffers(ephemeralKeyBytes, clientPublicBytes));
                break;
            }
            case 6: {
                const hashClient = await this.SHA(clientPublicBytes);
                const hashServer = await this.SHA(ephemeralKeyBytes);
                scheme.salt = await this.SHA(this.ConcatBuffers(hashClient, hashServer, initializationVector));
                scheme.infoString += `|${iv}`;
                break;
            }
            case 7: {
                scheme.salt = await this.HKDF(initializationVector, ephemeralKeyBytes, GetBytesFromUTF8(`${scheme.infoString}.salt`), 32);
                break;
            }
            case 8: {
                scheme.salt = await this.SHA(this.ConcatBuffers(
                    this.LengthPrefixed(clientPublicBytes),
                    this.LengthPrefixed(ephemeralKeyBytes),
                    this.LengthPrefixed(initializationVector),
                ));
                scheme.infoString += `|${GetHexFromBytes(initializationVector)}`;
                break;
            }
            case 9: {
                scheme.salt = (await this.HMAC(initializationVector,
                    this.ConcatBuffers(
                        this.LengthPrefixed(ephemeralKeyBytes),
                        this.LengthPrefixed(clientPublicBytes),
                    ), 'SHA-512')).slice(0, 32);
                scheme.infoString += `|${GetHexFromBytes(await this.SHA(initializationVector)).slice(0, 16)}`;
                break;
            }
            case 10: {
                scheme.salt = await this.SHA(this.ConcatBuffers(
                    this.LengthPrefixed(clientPublicBytes),
                    this.LengthPrefixed(ephemeralKeyBytes),
                    this.LengthPrefixed(initializationVector),
                ), 'SHA-512');
                scheme.infoString += `|${GetHexFromBytes(await this.SHA(initializationVector, 'SHA-512')).slice(0, 24)}`;
                scheme.hash = 'SHA-512';
                break;
            }
            case 11: {
                scheme.salt = await this.HMAC(ephemeralKeyBytes,
                    this.ConcatBuffers(
                        this.LengthPrefixed(initializationVector),
                        this.LengthPrefixed(clientPublicBytes),
                    ), 'SHA-512');
                scheme.infoString += `|${GetURLBase64FromBytes(await this.SHA(initializationVector, 'SHA-384')).slice(0, 22)}`;
                scheme.hash = 'SHA-512';
                scheme.deriveNonce = true;
                break;
            }
            case 12: {

                scheme.salt = (await this.ClientKeyedSalt(ephemeralKeyBytes, initializationVector)).slice(0, 32);
                const infoMessage = await this.SHA(this.ConcatBuffers(
                    this.LengthPrefixed(initializationVector),
                ));

                scheme.infoString += `|${GetURLBase64FromBytes(infoMessage).slice(0, 22)}`;
                scheme.hash = 'SHA-384';
                scheme.deriveNonce = true;
                scheme.aad = await this.AAD('dilar.response.ecies.v12', version, extraParameter, ephemeralKeyBytes, initializationVector, GetBytesFromURLBase64(cipherText).length);
                break;
            }
            case 13: {
                scheme.salt = await this.ClientKeyedSalt(ephemeralKeyBytes, initializationVector);
                scheme.infoString += `|${GetURLBase64FromBytes(await this.SHA(this.ConcatBuffers(this.ToBigEndian16(initializationVector.length), initializationVector), 'SHA-512')).slice(0, 22)}`;
                scheme.hash = 'SHA-512';
                scheme.deriveNonce = true;
                scheme.aad = await this.AAD('dilar.response.ecies.v13', version, extraParameter, ephemeralKeyBytes, initializationVector, GetBytesFromURLBase64(cipherText).length);
                scheme.chacha = true;
                break;
            }
            case 14: {
                scheme.salt = await this.ServerKeyedSalt(ephemeralKeyBytes, initializationVector);
                scheme.infoString += `|${GetURLBase64FromBytes(await this.SHA(this.ConcatBuffers(this.ToBigEndian16(initializationVector.length), initializationVector), 'SHA-512')).slice(0, 22)}`;
                scheme.hash = 'SHA-512';
                scheme.deriveNonce = true;
                scheme.aad = await this.AAD('dilar.response.ecies.v14', version, extraParameter, ephemeralKeyBytes, initializationVector, GetBytesFromURLBase64(cipherText).length);
                scheme.gcmsiv = true;
                break;
            }
            case 15: {
                scheme.salt = await this.IvKeyedSalt(ephemeralKeyBytes, initializationVector);
                scheme.infoString += `|${GetURLBase64FromBytes(await this.SHA(this.ConcatBuffers(this.ToBigEndian16(initializationVector.length), initializationVector, this.ToBigEndian16(ephemeralKeyBytes.length), ephemeralKeyBytes), 'SHA-512')).slice(0, 22)}`;
                scheme.hash = 'SHA-512';
                scheme.deriveNonce = true;
                scheme.aad = await this.AAD('dilar.response.ecies.v15', version, extraParameter, ephemeralKeyBytes, initializationVector, GetBytesFromURLBase64(cipherText).length);
                scheme.aessiv = true;
                scheme.keyBytes = 64;
                break;
            }
            default: {
                throw new Error(`Unknown API decryption version : ${version} !`,);
            }
        }

        // 1. Import the shared secret as a base key for HKDF
        const baseKey = await crypto.subtle.importKey("raw", sharedSecretBits, { name: "HKDF" }, false, ["deriveKey", "deriveBits"]);

        // 2. Derive bits using HKDF
        const keyLength = scheme.keyBytes ?? 32;
        const lengthBytes = scheme.deriveNonce ? keyLength + 12 : 32;
        const derivedBits = await crypto.subtle.deriveBits(
            {
                name: "HKDF",
                hash: scheme.hash, // e.g., "SHA-256"
                salt: scheme.salt,
                info: GetBytesFromUTF8(scheme.infoString)
            },
            baseKey,
            lengthBytes * 8 // length in bits
        );

        // 3. Extract key and nonce from the derived bits
        const keyBytes = derivedBits.slice(0, keyLength);
        const nonceBytes = scheme.deriveNonce
            ? derivedBits.slice(keyLength, keyLength + 12)
            : initializationVector;

        // NOTE: The following AEAD modes are used by protocol versions 13..15
        // but are NOT provided by the WebCrypto (SubtleCrypto) standard API.
        // They must be implemented via external libraries (WASM or JS) or
        // by using Node native crypto when running in Node environment.
        //
        // - ChaCha20-Poly1305 (v13): recommended libsodium-wrappers (WASM) or
        //   tweetnacl / libsodium for accurate, high-performance implementations.
        // - AES-GCM-SIV (v14): misuse-resistant AES-GCM variant; consider
        //   "miscreant" (WASM/JS) or a dedicated AES-GCM-SIV implementation.
        // - AES-SIV (v15): requires an AES-SIV implementation (e.g. miscreant AesSiv).
        //
        // TODO: integrate chosen libraries and call their decrypt functions here.
        // For now we throw explicit errors to indicate unsupported cipher types.
        if (scheme.chacha) {
            const data = chacha20Poly1305Decrypt(new Uint8Array(keyBytes), new Uint8Array(nonceBytes), GetBytesFromURLBase64(cipherText), GetBytesFromURLBase64(tag), scheme.aad);
            return <T>JSON.parse(GetUTF8FromBytes(data));
        }

        if (scheme.gcmsiv) {
            throw new Error('AES-GCM-SIV decryption not implemented in this environment');
        }

        if (scheme.aessiv) {
            throw new Error('AES-SIV decryption not implemented in this environment');
        }

        // 4. Import the derived key for AES-GCM (expects 32 bytes)
        const cryptoKey = await crypto.subtle.importKey(
            "raw",
            keyBytes,
            { name: "AES-GCM" },
            false,
            ["decrypt"]
        );

        // 5. Set up AES-GCM decryption parameters
        const decryptParams: AesGcmParams = {
            name: "AES-GCM",
            iv: nonceBytes,
        };

        if (scheme.aad) {
            decryptParams.additionalData = scheme.aad;
        }

        const combinedCiphertextAndTag = this.ConcatBuffers(GetBytesFromURLBase64(cipherText), GetBytesFromURLBase64(tag));
        const decryptedBuffer = await crypto.subtle.decrypt(
            decryptParams,
            cryptoKey,
            combinedCiphertextAndTag
        );
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
            body,
            headers: {
                'X-Crypto-Caps': '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15',
                'X-DH-Pub': await this.#drm.GetClientPubB64()
            }
        });
        if (parameters) Object.entries(parameters).forEach(([name, value]) => request.headers.set(name, value));

        return FetchJSON<T>(request);
    }
}