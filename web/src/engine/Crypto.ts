import { GetBytesFromUTF8 } from './BufferEncoder';

// TODO: Improve TS-DOC ...
export async function HashUTF8(algorithm: 'SHA256' | 'SHA-256' | 'SHA512' | 'SHA-512', text: string) {
    return new Uint8Array(await crypto.subtle.digest(algorithm, GetBytesFromUTF8(text)));
}

// TODO: Improve TS-DOC ...
export function XOR(encrypted: Uint8Array, key: Uint8Array): Uint8Array<ArrayBuffer> {
    return encrypted.map((byte, index) => byte ^ key[index % key.length]);
}

// TODO: Improve TS-DOC ...
// Decrypt with AES importing the RAW key-data with the exactly same algorithm identifier
export async function DecryptAES(encrypted: BufferSource, keyData: BufferSource, algorithm: AesCtrParams | AesCbcParams | AesGcmParams): Promise<ArrayBuffer> {
    const key = await crypto.subtle.importKey('raw', keyData, algorithm.name, false, ['decrypt']);
    return crypto.subtle.decrypt(algorithm, key, encrypted);
}