/**
 * Get the bytes from an HEX encoded string.
 */
export function GetBytesFromHex(encoded: string): Uint8Array {
    if(typeof encoded !== 'string') throw new TypeError();
    if(encoded.length % 2 !== 0 || !/^[0-9A-F]*$/i.test(encoded)) throw new RangeError();
    return Uint8Array.from(new Array(encoded.length / 2), (_, index) => {
        const offset = 2 * index;
        return parseInt(encoded.slice(offset, offset + 2), 16);
    });
}

/**
 * Get the HEX encoded string from bytes (lower-case).
 */
export function GetHexFromBytes(bytes: Uint8Array): string {
    if(bytes instanceof Uint8Array === false) throw new TypeError();
    return Array.from(bytes).map(byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Get the bytes from an UTF-8 encoded string.
 */
export function GetBytesFromUTF8(encoded: string): Uint8Array {
    if(typeof encoded !== 'string') throw new TypeError();
    return new TextEncoder().encode(encoded);
};

/**
 * Get the bytes from a Base64 (not {@link https://base64.guru/standards/base64url | Base64URL}) encoded string.
 */
export function GetBytesFromBase64(encoded: string): Uint8Array {
    if(typeof encoded !== 'string') throw new TypeError();
    if(encoded.length % 4 !== 0 || !/^[+/a-zA-Z0-9]*={0,3}$/i.test(encoded)) throw new RangeError();
    return Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
}

/**
 * Get the Base64 (not {@link https://base64.guru/standards/base64url | Base64URL}) encoded string from bytes.
 */
export function GetBase64FromBytes(bytes: Uint8Array): string {
    if(bytes instanceof Uint8Array === false) throw new TypeError();
    return btoa(String.fromCharCode.apply(null, Array.from(bytes)));
}