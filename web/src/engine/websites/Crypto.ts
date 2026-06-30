/**
 * Perform a basic XOR operation
 * @param source - Bytes to be xored
 * @param key - XOR key
 */
export function XOR(source: Uint8Array, key: Uint8Array): Uint8Array<ArrayBuffer> {
    return source.map((byte, index) => byte ^ key[index % key.length]);
}