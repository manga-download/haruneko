import { GetBytesFromUTF8 } from './BufferEncoder';

/**
 * Perform a basic XOR operation
 * @param source - Bytes to be xored
 * @param key - XOR key
 */
export function XOR(source: Uint8Array, key: Uint8Array): Uint8Array<ArrayBuffer> {
    return source.map((byte, index) => byte ^ key[index % key.length]);
}

export async function SHA256(message: string | BufferSource): Promise<ArrayBuffer> {
    if (typeof message === 'string') message = GetBytesFromUTF8(message);
    return crypto.subtle.digest({ name: 'SHA-256' }, message);
}

export async function HMAC256(message: string | BufferSource, keyData: string | BufferSource): Promise<ArrayBuffer> {
    const algorithm = { name: 'HMAC', hash: { name: 'SHA-256' } };
    if (typeof message === 'string') message = GetBytesFromUTF8(message);
    if (typeof keyData === 'string') keyData = GetBytesFromUTF8(keyData);
    const key = await crypto.subtle.importKey('raw', keyData, algorithm, false, ['sign']);
    return crypto.subtle.sign(algorithm, key, message);
}