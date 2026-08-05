import { GetBytesFromUTF8 } from './BufferEncoder';

type DigestAlgorithm = 'SHA256' | 'SHA-256' | 'SHA512' | 'SHA-512';

export async function HashUTF8(algorithm: DigestAlgorithm, text: string) {
    return new Uint8Array(await crypto.subtle.digest(algorithm, GetBytesFromUTF8(text)));
}

export function XOR(encrypted: Uint8Array, key: Uint8Array): Uint8Array<ArrayBuffer> {
    return encrypted.map((byte, index) => byte ^ key[index % key.length]);
}

export async function AESDecrypt(_encrypted: unknown, _keyData: unknown, _algorithm: unknown) {
    throw new Error(`[DEPRECATED] Migrate to 'DecryptAES' instead!`);
}

export async function DecryptAES(encrypted: BufferSource, keyData: BufferSource, algorithm: AesCtrParams | AesCbcParams | AesGcmParams): Promise<ArrayBuffer> {
    const key = await crypto.subtle.importKey('raw', keyData, algorithm.name, false, ['decrypt']);
    return crypto.subtle.decrypt(algorithm, key, encrypted);
}