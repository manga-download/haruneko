import { GetBytesFromUTF8 } from './BufferEncoder';

type AesParams = AesCtrParams | AesCbcParams | AesGcmParams;

/**
 * Decode the bytes from a given {@link text} (UTF-8) and calculate its checksum based on the given {@link algorithm}.
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
 * Applies a repeating-key XOR operation between a UTF-8 encrypted string and a key.
 * @param encrypted - The input string to convert and process.
 * @param key - The key byte array used for the XOR operation.
 * @returns A new `Uint8Array` containing the XOR-transformed bytes.
 */
export function XorUTF8(encrypted: string, key: Uint8Array): Uint8Array<ArrayBuffer> {
    return Xor(GetBytesFromUTF8(encrypted), key);
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

/**
 * Generates an HMAC signature for a message using raw key data and a specified hash algorithm.
 * @param message - The message binary data to sign.
 * @param keyData - The raw key material as a `BufferSource`.
 * @param hash - The hashing algorithm to use for the HMAC ('SHA-256' or 'SHA-512').
 * @returns A promise that resolves to an `ArrayBuffer` containing the cryptographic signature.
 */
export async function HMACSign(message: BufferSource, keyData: BufferSource, hash: 'SHA-256' | 'SHA-512'): Promise<ArrayBuffer> {
    const key = await HMACImportKey(keyData, hash);
    return HMACSignWithKey(message, key);
}

/**
 * Generates an HMAC signature for a message using an already imported `CryptoKey`.
 * @param message - The message binary data to sign.
 * @param key - The imported `CryptoKey` configured for signing.
 * @returns A promise that resolves to an `ArrayBuffer` containing the cryptographic signature.
 */
export async function HMACSignWithKey(message: BufferSource, key: CryptoKey): Promise<ArrayBuffer> {
    return crypto.subtle.sign('HMAC', key, message);
}

/**
 * Imports raw key data as an HMAC `CryptoKey` bound to a specific hash algorithm.
 * @param key - The raw key material as a `BufferSource`.
 * @param hash - The hashing algorithm to associate with the HMAC key ('SHA-256' or 'SHA-512').
 * @returns A promise that resolves to the imported `CryptoKey`.
 */
export async function HMACImportKey(key: BufferSource, hash: 'SHA-256' | 'SHA-512'): Promise<CryptoKey> {
    return crypto.subtle.importKey('raw', key, { name: 'HMAC', hash }, false, ['sign', 'verify']);
}