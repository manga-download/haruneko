import { GetBytesFromUTF8 } from './BufferEncoder';

export const HMAC256Algo = { name: 'HMAC', hash: { name: 'SHA-256' } };

type BufferSourceLike = BufferSource | string;
/**
 * Options for AES encryption and decryption operations.
 */
export interface AesOptions {
    /**
     * AES block cipher mode.
     */
    mode: 'CTR' | 'CBC' | 'GCM';

    /**
     * Initialization vector (IV).
     *
     * Required for `CBC` and `GCM`.
     *
     * Typical sizes:
     * - CBC: 16 bytes
     * - GCM: 12 bytes (recommended)
     */
    iv?: BufferSourceLike;

    /**
     * Initial counter value.
     *
     * Required for `CTR`.
     */
    counter?: BufferSourceLike;

    /**
     * Counter length, in bits.
     *
     * Only used for `CTR`.
     *
     * @defaultValue 64
     */
    length?: number;

    /**
     * Authentication tag length, in bits.
     *
     * Only used for `GCM`.
     *
     * @defaultValue 128
     */
    tagLength?: number;
}

function ToUint8Array(data: BufferSourceLike) {
    return typeof data === 'string' ? GetBytesFromUTF8(data) : data;
}

/**
 * Performs a byte-wise XOR operation.
 *
 * If either argument is a string, it is first encoded as UTF-8.
 *
 * The key is repeated as necessary until the entire source has been processed.
 *
 * @param source - Input data to XOR.
 * @param key - XOR key.
 * @returns The XOR result.
 */
export function XOR(source: Uint8Array | string, key: Uint8Array | string): Uint8Array<ArrayBuffer> {
    if (!key) throw new Error(`Argument 'key' is missing !`);
    if (!source) throw new Error(`Argument 'source' is missing !`);

    const sourceBytes = source instanceof Uint8Array ? source : GetBytesFromUTF8(source);
    const keyBytes = key instanceof Uint8Array ? key : GetBytesFromUTF8(key);

    if (keyBytes.length === 0) throw new RangeError('Key must not be empty !');
    if (sourceBytes.length === 0) throw new RangeError('Source must not be empty !');

    return sourceBytes.map((byte, index) => byte ^ keyBytes[index % keyBytes.length]);
}

/**
 * Computes the SHA-256 digest of a message.
 *
 * Strings are encoded as UTF-8 before hashing.
 *
 * @param message - Data to hash.
 * @returns A promise that resolves to the SHA-256 digest.
 */
export async function SHA256(message: BufferSourceLike): Promise<ArrayBuffer> {
    return HASH(ToUint8Array(message), 'SHA-256');
}

/**
 * Computes the SHA-512 digest of a message.
 *
 * Strings are encoded as UTF-8 before hashing.
 *
 * @param message - Data to hash.
 * @returns A promise that resolves to the SHA-512 digest.
 */
export async function SHA512(message: BufferSourceLike): Promise<ArrayBuffer> {
    return HASH(ToUint8Array(message), 'SHA-512');
}

async function HASH(message: BufferSource, hashType: string): Promise<ArrayBuffer> {
    return crypto.subtle.digest({ name: hashType }, message);
}

/**
 * Computes an HMAC-SHA-256 signature.
 *
 * Strings are encoded as UTF-8 before processing.
 *
 * @param message - Message to sign.
 * @param key - Raw key or an existing {@link CryptoKey}.
 * @returns A promise that resolves to the computed HMAC signature.
 */
export async function HMAC256(message: BufferSourceLike, key: BufferSourceLike | CryptoKey): Promise<ArrayBuffer> {
    return crypto.subtle.sign(HMAC256Algo, await HMAC256ImportKey(key), ToUint8Array(message));
}

/**
 * Imports a key for use with HMAC-SHA-256.
 *
 * If the supplied key is already a {@link CryptoKey}, it is returned unchanged.
 * Strings are encoded as UTF-8 before import.
 *
 * @param key - Raw key material or an existing {@link CryptoKey}.
 * @returns A promise that resolves to an HMAC signing key.
 */
export async function HMAC256ImportKey(key: BufferSourceLike | CryptoKey): Promise<CryptoKey> {
    // Don't use `instanceof CryptoKey` here: CryptoKeys may come from a different
    // execution context (e.g. Puppeteer), making `instanceof` unreliable.
    const isCryptoKey = typeof key === 'object' && key !== null &&
        typeof (key as CryptoKey).type === 'string' &&
        typeof (key as CryptoKey).algorithm === 'object' &&
        typeof (key as CryptoKey).extractable === 'boolean' &&
        Array.isArray((key as CryptoKey).usages);
    if (isCryptoKey) return key as CryptoKey;

    key = ToUint8Array(key as BufferSourceLike); //convert to UintArray in case of a string
    if (key instanceof ArrayBuffer || ArrayBuffer.isView(key)) key = await crypto.subtle.importKey('raw', key, HMAC256Algo, false, ['sign']);

    return key;
}

/**
 * Decrypts data using the Web Crypto API with the specified AES mode.
 *
 * Supports AES-CTR, AES-CBC, and AES-GCM. Strings are encoded as UTF-8 before
 * being imported or processed.
 *
 * Required parameters depend on the selected mode:
 *
 * - **CTR**: Requires `counter`.
 * - **CBC**: Requires `iv`.
 * - **GCM**: Requires `iv`.
 *
 * @param data - Ciphertext to decrypt.
 * @param key - Raw AES key.
 * @param options - AES algorithm options.
 * @returns A promise that resolves to the decrypted plaintext.
 */
export async function AESDecrypt(data: BufferSourceLike, key: BufferSourceLike, options: AesOptions): Promise<ArrayBuffer> {

    const keyBytes = ToUint8Array(key);
    const dataBytes = ToUint8Array(data);

    const { mode, counter, iv, length, tagLength } = options;
    const cryptoKey = await crypto.subtle.importKey('raw', keyBytes, 'AES-' + mode, false, ['decrypt']);

    let algorithm: AesCtrParams | AesCbcParams | AesGcmParams;

    switch (mode) {
        case 'CTR':
            if (!counter) throw new TypeError('CTR mode requires a counter.');
            algorithm = { name: 'AES-CTR', counter: ToUint8Array(counter), length: length ?? 64 };
            break;

        case 'CBC':
            if (!iv) throw new TypeError('CBC mode requires an IV.');
            algorithm = { name: 'AES-CBC', iv: ToUint8Array(iv) };
            break;

        case 'GCM':
            if (!iv) throw new TypeError('GCM mode requires an IV.');
            algorithm = { name: 'AES-GCM', iv: ToUint8Array(iv), tagLength: tagLength ?? 128 };
            break;
    }
    return crypto.subtle.decrypt(algorithm, cryptoKey, dataBytes,);
}

/**
 * Encrypts data using the Web Crypto API with the specified AES mode.
 *
 * Supports AES-CTR, AES-CBC, and AES-GCM. The encryption key and input data
 * may be provided as either UTF-8 strings or binary data. The required
 * encryption parameters depend on the selected mode:
 *
 * - **CTR**: Requires a `counter`. The counter length defaults to `64` bits.
 * - **CBC**: Requires an initialization vector (`iv`).
 * - **GCM**: Requires an initialization vector (`iv`). The authentication
 *   tag length defaults to `128` bits.
 *
 * @param data - The plaintext to encrypt. Strings are UTF-8 encoded before
 * encryption.
 * @param key - The raw AES key. Strings are UTF-8 encoded before import.
 * The key length must be valid for the selected AES algorithm (128, 192,
 * or 256 bits).
 * @param options - Encryption options including the AES mode and any
 * mode-specific parameters.
 *
 * @returns A promise that resolves to an {@link ArrayBuffer} containing the
 * encrypted ciphertext. For AES-GCM, the authentication tag is appended to
 * the ciphertext as defined by the Web Crypto API.s.
 */
export async function AESEncrypt(data: BufferSourceLike, key: BufferSourceLike, options: AesOptions): Promise<ArrayBuffer> {

    const keyBytes = ToUint8Array(key);
    const dataBytes = ToUint8Array(data);
    const { mode, counter, iv, length, tagLength } = options;

    const cryptoKey = await crypto.subtle.importKey('raw', keyBytes, 'AES-' + mode, false, ['encrypt'],);

    let algorithm: AesCtrParams | AesCbcParams | AesGcmParams;

    switch (mode) {
        case 'CTR':
            if (!counter) throw new TypeError('CTR mode requires a counter.');
            algorithm = { name: 'AES-CTR', counter: ToUint8Array(counter), length: length ?? 64 };
            break;

        case 'CBC':
            if (!iv) throw new TypeError('CBC mode requires an IV.');
            algorithm = { name: 'AES-CBC', iv: ToUint8Array(iv), };
            break;

        case 'GCM':
            if (!iv) throw new TypeError('GCM mode requires an IV.');
            algorithm = { name: 'AES-GCM', iv: ToUint8Array(iv), tagLength: tagLength ?? 128 };
            break;
    }
    return crypto.subtle.encrypt(algorithm, cryptoKey, dataBytes,);
}