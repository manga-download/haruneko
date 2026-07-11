import { GetBytesFromUTF8 } from './BufferEncoder';

/**
 * Perform a XOR operation
 * @param source - Bytes to be xored
 * @param key - XOR key
 */
export function XOR(source: Uint8Array, key: Uint8Array): Uint8Array<ArrayBuffer> {
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
 * Compute a HMAC (with SHA-256) signature the provided data
 * @param message - Bytes/string to be hashed
 */
export async function HMAC256(message: string | BufferSource, keyData: string | BufferSource): Promise<ArrayBuffer> {
    const algorithm = { name: 'HMAC', hash: { name: 'SHA-256' } };
    if (typeof message === 'string') message = GetBytesFromUTF8(message);
    if (typeof keyData === 'string') keyData = GetBytesFromUTF8(keyData);
    const key = await crypto.subtle.importKey('raw', keyData, algorithm, false, ['sign']);
    return crypto.subtle.sign(algorithm, key, message);
}