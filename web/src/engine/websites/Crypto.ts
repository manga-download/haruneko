/*
function Xor(sourceArray: Uint8Array, keyArray: Uint8Array) {
    const result = new Uint8Array(sourceArray.length);
    for (let index = 0; index < sourceArray.length; index++)
        result[index] = sourceArray[index] ^ keyArray[index % keyArray.length];
    return result.buffer;
}

function Xor2(sourceArray: Uint8Array, mask: number) {
    const result = new Uint8Array(sourceArray.length);
    for (let index = 0; index < sourceArray.length; index++)
        result[index] = sourceArray[index] ^ mask;
    return result.buffer;
}*/

/**
 * Perform a basic XOR operation
 * @param source - Bytes to be xored
 * @param key - XOR key
 */
export function XOR(source: Uint8Array, key: Uint8Array): Uint8Array<ArrayBuffer> {
    return source.map((byte, index) => byte ^ key[index % key.length]);
}