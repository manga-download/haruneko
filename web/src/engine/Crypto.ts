import { GetBytesFromUTF8 } from './BufferEncoder';

export const HMAC256Algo = { name: 'HMAC', hash: { name: 'SHA-256' } };

/**
 * Perform a XOR operation
 * @param source - data to be xored. If a string is passed, its UTF8 bytes will be used.
 * @param key - XOR key. If a string is passed, its UTF8 bytes will be used.
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
 * Perform a SHA256 operation
 * @param message - Bytes/string to be hashed.If a string is passed, its UTF8 bytes will be used.
 */
export async function SHA256(message: string | BufferSource): Promise<ArrayBuffer> {
    if (typeof message === 'string') message = GetBytesFromUTF8(message);
    return HASH(message, 'SHA-256');
}

/**
 * Perform a SHA512 operation
 * @param message - Bytes/string to be hashed. If a string is passed, its UTF8 bytes will be used.
 */
export async function SHA512(message: string | BufferSource): Promise<ArrayBuffer> {
    if (typeof message === 'string') message = GetBytesFromUTF8(message);
    return HASH(message, 'SHA-512');
}

async function HASH(message: BufferSource, hashType: string): Promise<ArrayBuffer> {
    return crypto.subtle.digest({ name: hashType }, message);
}

/**
 * Compute a HMAC (with SHA-256) signature for the provided data
 * @param message - Bytes/string to be hashed. If a string is passed, its UTF8 bytes will be used.
 * @param key - key used to sign. If a string is passed, its UTF8 bytes will be used.
 */
export async function HMAC256(message: string | BufferSource, key: string | BufferSource | CryptoKey): Promise<ArrayBuffer> {
    if (typeof message === 'string') message = GetBytesFromUTF8(message);
    return crypto.subtle.sign(HMAC256Algo, await HMAC256ImportKey(key), message);
}

/**
 * Compute a HMAC (with SHA-256) Key
 * @param key - data to use as key. If a string is passed, its UTF8 bytes will be used.
 */
export async function HMAC256ImportKey(key: string | BufferSource | CryptoKey): Promise<CryptoKey> {
    // Don't use `instanceof CryptoKey` here: CryptoKeys may come from a different
    // execution context (e.g. Puppeteer), making `instanceof` unreliable.
    if (typeof key === 'string') key = GetBytesFromUTF8(key);
    if (key instanceof ArrayBuffer || ArrayBuffer.isView(key)) key = await crypto.subtle.importKey('raw', key, HMAC256Algo, false, ['sign']);

    const isCryptoKey = typeof key === 'object' && key !== null &&
        typeof (key as CryptoKey).type === 'string' &&
        typeof (key as CryptoKey).algorithm === 'object' &&
        typeof (key as CryptoKey).extractable === 'boolean' &&
        Array.isArray((key as CryptoKey).usages);

    if (!isCryptoKey) throw new TypeError('Expected key must be a string, a BufferSource, or already a CryptoKey');
    return key;
}