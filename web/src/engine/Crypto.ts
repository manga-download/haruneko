import { GetBytesFromUTF8 } from './BufferEncoder';

type AesParams = AesCtrParams | AesCbcParams | AesGcmParams;

/**
 * Decode the bytes from the given {@link text} (UTF8-based) and calculate its checksum for the provided {@link algorithm}.
 */
export async function HashUTF8(algorithm: 'SHA-256' | 'SHA-512', text: string): Promise<Uint8Array<ArrayBuffer>> {
    return new Uint8Array(await crypto.subtle.digest(algorithm, GetBytesFromUTF8(text)));
}

/**
 * Perform a byte-wise XOR operation for the given {@link bytes} with the provided {@link key}.
 * When the size of the {@link bytes} exceeds the size of the {@link key}, the {@link key} is repeated.
 */
export function DecryptXOR(bytes: Uint8Array, key: Uint8Array): Uint8Array<ArrayBuffer> {
    return bytes.map((byte, index) => byte ^ key[index % key.length]);
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