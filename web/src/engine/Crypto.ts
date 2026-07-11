import { GetBytesFromUTF8 } from './BufferEncoder';

export const HMAC256Algo = { name: 'HMAC', hash: { name: 'SHA-256' } };

/**
 * Perform a XOR operation
 * @param source - Bytes to be xored
 * @param key - XOR key
 */
export function XOR(source: Uint8Array, key: Uint8Array): Uint8Array<ArrayBuffer> {
    if (key.length === 0) throw new RangeError('XOR key must not be empty');
    return source.map((byte, index) => byte ^ key[index % key.length]);
}

/**
 * Perform a SHA256 operation
 * @param message - Bytes/string to be hashed
 */
export async function SHA256(message: string | BufferSource): Promise<ArrayBuffer> {
    if (typeof message === 'string') message = GetBytesFromUTF8(message);
    return HASH(message, 'SHA-256');
}

/**
 * Perform a SHA512 operation
 * @param message - Bytes/string to be hashed
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
 * @param message - Bytes/string to be hashed
 * @param key - key used to sign.
 */
export async function HMAC256(message: string | BufferSource, key: string | BufferSource | CryptoKey): Promise<ArrayBuffer> {
    if (typeof message === 'string') message = GetBytesFromUTF8(message);
    return crypto.subtle.sign(HMAC256Algo, await HMAC256ImportKey(key), message);
}

/**
 * Compute a HMAC (with SHA-256) Key
 * @param key - data to use as key
 */
export async function HMAC256ImportKey(key: string | BufferSource | CryptoKey): Promise<CryptoKey> {
    // Don't use `instanceof CryptoKey` here: CryptoKeys may come from a different
    // execution context (e.g. Puppeteer), making `instanceof` unreliable.
    if (typeof key === 'string') key = GetBytesFromUTF8(key);
    if (key instanceof ArrayBuffer || ArrayBuffer.isView(key)) key = await crypto.subtle.importKey('raw', key, HMAC256Algo, false, ['sign']);
    return key;
}