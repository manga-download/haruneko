import { GetBytesFromUTF8 } from './BufferEncoder';

type AesParams = AesCtrParams | AesCbcParams | AesGcmParams;

/**
 * Decode the bytes from the given {@link text} (UTF8-based) and calculate its checksum for the provided {@link algorithm}.
 */
export async function HashUTF8(algorithm: 'SHA-256' | 'SHA-512', text: string): Promise<Uint8Array<ArrayBuffer>> {
    return new Uint8Array(await crypto.subtle.digest(algorithm, GetBytesFromUTF8(text)));
}

/**
 * Applies a repeating-key XOR operation between an encrypted byte array and a key.
 * @param encrypted - The input byte array to process.
 * @param key - The key byte array used for the XOR operation.
 * @returns A new `Uint8Array` containing the XOR-transformed bytes.
 */
export function Xor(encrypted: Uint8Array, key: Uint8Array): Uint8Array<ArrayBuffer> {
    return encrypted.map((byte, index) => byte ^ key[index % key.length]);
}

/**
 * Decrypts a UTF-8 encoded encrypted string using AES with raw key data.
 * @param encrypted - The encrypted string to decrypt.
 * @param keyData - The raw key material as a `BufferSource`.
 * @param algorithm - The AES parameters (e.g., CBC, GCM, CTR configuration).
 * @returns A promise that resolves to an `ArrayBuffer` containing the decrypted data.
 */
export async function DecryptAESUTF8(encrypted: string, keyData: BufferSource, algorithm: AesParams): Promise<ArrayBuffer> {
    return DecryptAES(GetBytesFromUTF8(encrypted), keyData, algorithm);
}

/**
 * Decrypts binary data using AES by importing raw key data with the matching algorithm identifier.
 * @param encrypted - The encrypted binary data to decrypt.
 * @param keyData - The raw key material as a `BufferSource`.
 * @param algorithm - The AES parameters (e.g., CBC, GCM, CTR configuration).
 * @returns A promise that resolves to an `ArrayBuffer` containing the decrypted data.
 */
export async function DecryptAES(encrypted: BufferSource, keyData: BufferSource, algorithm: AesParams): Promise<ArrayBuffer> {
    const key = await crypto.subtle.importKey('raw', keyData, algorithm.name, false, ['decrypt']);
    return crypto.subtle.decrypt(algorithm, key, encrypted);
}