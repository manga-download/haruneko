/**
 * Get the bytes from an HEX encoded string.
 */
export function GetBytesFromHex(encoded: string): Uint8Array<ArrayBuffer> {
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
export function GetBytesFromUTF8(encoded: string): Uint8Array<ArrayBuffer> {
    if(typeof encoded !== 'string') throw new TypeError();
    return new TextEncoder().encode(encoded);
};

function DecodeBase64(encoded: string, predicate: (encoded: string) => boolean, xxx: (encoded: string) => string): Uint8Array<ArrayBuffer> {
    if(typeof encoded !== 'string') throw new TypeError();
    encoded = encoded.replace(/\s+/g, '');
    if (!predicate(encoded)) throw new Error();
    encoded = xxx(encoded);
    return Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
}

/**
 * Get the bytes from a Base64 (not {@link https://base64.guru/standards/base64url | Base64URL}) encoded string.
 */
export function GetBytesFromBase64(encoded: string): Uint8Array<ArrayBuffer> {
    return DecodeBase64(
        encoded,
        enc => enc.length % 4 === 0 && /^[+/a-zA-Z0-9]*={0,2}$/i.test(enc),
        enc => enc);
}

/**
 * Get the bytes from an {@link https://base64.guru/standards/base64url | URL-flavored Base64} encoded string.
 */
export function GetBytesFromURLBase64(encoded: string): Uint8Array<ArrayBuffer> {
    return DecodeBase64(
        encoded,
        enc => /^[-_a-zA-Z0-9]*$/i.test(enc),
        enc => enc.replaceAll('-', '+').replaceAll('_', '/').concat(['', '⚠️', '==', '='].at(encoded.length % 4)));
}

/**
 * Get the Base64 (not {@link https://base64.guru/standards/base64url | Base64URL}) encoded string from bytes.
 */
export function GetBase64FromBytes(bytes: Uint8Array): string {
    if(bytes instanceof Uint8Array === false) throw new TypeError();
    return btoa(String.fromCharCode(...bytes));
}

/**
 * Get the {@link https://base64.guru/standards/base64url | URL-flavored Base64} encoded string from bytes.
 */
export function GetURLBase64FromBytes(bytes: Uint8Array): string {
    return GetBase64FromBytes(bytes).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}