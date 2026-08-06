import { GetBytesFromUTF8 } from './BufferEncoder';

type HashType = 'SHA-256' | 'SHA-512';
type AesParams = AesCtrParams | AesCbcParams | AesGcmParams;

// TODO: Improve TS-DOC ...
export async function HashUTF8(algorithm: HashType, text: string): Promise<Uint8Array<ArrayBuffer>> {
    return Hash(algorithm, GetBytesFromUTF8(text));
}

// TODO: Improve TS-DOC ...
export async function Hash(algorithm: HashType, message: Uint8Array<ArrayBuffer>): Promise<Uint8Array<ArrayBuffer>> {
    return new Uint8Array(await crypto.subtle.digest(algorithm, message));
}

// TODO: Improve TS-DOC ...
export function Xor(encrypted: Uint8Array, key: Uint8Array): Uint8Array<ArrayBuffer> {
    return encrypted.map((byte, index) => byte ^ key[index % key.length]);
}
export function XorUTF8(encrypted: string, key: Uint8Array): Uint8Array<ArrayBuffer> {
    return Xor(GetBytesFromUTF8(encrypted), key);
}

// TODO: Improve TS-DOC ...
// Decrypt with AES importing the RAW key-data with the exactly same algorithm identifier
export async function DecryptAESUTF8(encrypted: string, keyData: BufferSource, algorithm: AesParams): Promise<ArrayBuffer> {
    return DecryptAES(GetBytesFromUTF8(encrypted), keyData, algorithm);
}

// TODO: Improve TS-DOC ...
// Decrypt with AES importing the RAW key-data with the exactly same algorithm identifier
export async function DecryptAES(encrypted: BufferSource, keyData: BufferSource, algorithm: AesParams): Promise<ArrayBuffer> {
    const key = await crypto.subtle.importKey('raw', keyData, algorithm.name, false, ['decrypt']);
    return crypto.subtle.decrypt(algorithm, key, encrypted);
}

export async function HMACSign(message: BufferSource, keyData: BufferSource, hash: HashType): Promise<ArrayBuffer> {
    const key = await HMACImportKey(keyData, hash);
    return HMACSignWithKey(message, key);
}

export async function HMACSignWithKey(message: BufferSource, key: CryptoKey): Promise<ArrayBuffer> {
    return crypto.subtle.sign('HMAC', key, message);
}

/**
 * Imports a BufferSource as an HMAC CryptoKey.
 */
export async function HMACImportKey(key: BufferSource, hash: HashType): Promise<CryptoKey> {
    return crypto.subtle.importKey('raw', key, { name: 'HMAC', hash }, false, ['sign', 'verify']);
}
