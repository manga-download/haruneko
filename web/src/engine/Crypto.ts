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

// Pure JS ChaCha20-Poly1305 AEAD decrypt (IETF variant).
// Inputs and outputs use Uint8Array<ArrayBuffer> to match project types.
export function chacha20Poly1305Decrypt(key: Uint8Array<ArrayBuffer>, nonce: Uint8Array<ArrayBuffer>, ciphertext: Uint8Array<ArrayBuffer>, tag: Uint8Array<ArrayBuffer>, aad: Uint8Array<ArrayBuffer> = new Uint8Array(0)): Uint8Array<ArrayBuffer> {
    if (key.length !== 32) throw new TypeError('Invalid key length for ChaCha20');
    if (nonce.length !== 12) throw new TypeError('Invalid nonce length for ChaCha20-Poly1305');
    // --- ChaCha20 core ---
    const ROTL = (v: number, c: number) => (v << c) | (v >>> (32 - c));

    function U8TO32_LE(src: Uint8Array<ArrayBuffer>, i: number) {
        return (src[i] | (src[i + 1] << 8) | (src[i + 2] << 16) | (src[i + 3] << 24)) >>> 0;
    }

    function U32TO8_LE(dst: Uint8Array<ArrayBuffer>, i: number, v: number) {
        dst[i] = v & 0xff;
        dst[i + 1] = (v >>> 8) & 0xff;
        dst[i + 2] = (v >>> 16) & 0xff;
        dst[i + 3] = (v >>> 24) & 0xff;
    }

    function chacha20Block(key32: Uint8Array<ArrayBuffer>, counter: number, nonce12: Uint8Array<ArrayBuffer>): Uint8Array<ArrayBuffer> {
        const out = new Uint8Array(64);
        const state = new Uint32Array(16);
        // constants
        state[0] = 0x61707865; state[1] = 0x3320646e; state[2] = 0x79622d32; state[3] = 0x6b206574;
        // key
        for (let i = 0; i < 8; i++) state[4 + i] = U8TO32_LE(key32, i * 4);
        state[12] = counter >>> 0;
        state[13] = U8TO32_LE(nonce12, 0);
        state[14] = U8TO32_LE(nonce12, 4);
        state[15] = U8TO32_LE(nonce12, 8);

        const working = new Uint32Array(state);

        for (let i = 0; i < 10; i++) {
            // column rounds
            // quarter round on (0,4,8,12)
            let a = 0, b = 4, c = 8, d = 12;
            working[a] = (working[a] + working[b]) >>> 0; working[d] ^= working[a]; working[d] = ROTL(working[d], 16) >>> 0;
            working[c] = (working[c] + working[d]) >>> 0; working[b] ^= working[c]; working[b] = ROTL(working[b], 12) >>> 0;
            working[a] = (working[a] + working[b]) >>> 0; working[d] ^= working[a]; working[d] = ROTL(working[d], 8) >>> 0;
            working[c] = (working[c] + working[d]) >>> 0; working[b] ^= working[c]; working[b] = ROTL(working[b], 7) >>> 0;
            // (1,5,9,13)
            a = 1; b = 5; c = 9; d = 13;
            working[a] = (working[a] + working[b]) >>> 0; working[d] ^= working[a]; working[d] = ROTL(working[d], 16) >>> 0;
            working[c] = (working[c] + working[d]) >>> 0; working[b] ^= working[c]; working[b] = ROTL(working[b], 12) >>> 0;
            working[a] = (working[a] + working[b]) >>> 0; working[d] ^= working[a]; working[d] = ROTL(working[d], 8) >>> 0;
            working[c] = (working[c] + working[d]) >>> 0; working[b] ^= working[c]; working[b] = ROTL(working[b], 7) >>> 0;
            // (2,6,10,14)
            a = 2; b = 6; c = 10; d = 14;
            working[a] = (working[a] + working[b]) >>> 0; working[d] ^= working[a]; working[d] = ROTL(working[d], 16) >>> 0;
            working[c] = (working[c] + working[d]) >>> 0; working[b] ^= working[c]; working[b] = ROTL(working[b], 12) >>> 0;
            working[a] = (working[a] + working[b]) >>> 0; working[d] ^= working[a]; working[d] = ROTL(working[d], 8) >>> 0;
            working[c] = (working[c] + working[d]) >>> 0; working[b] ^= working[c]; working[b] = ROTL(working[b], 7) >>> 0;
            // (3,7,11,15)
            a = 3; b = 7; c = 11; d = 15;
            working[a] = (working[a] + working[b]) >>> 0; working[d] ^= working[a]; working[d] = ROTL(working[d], 16) >>> 0;
            working[c] = (working[c] + working[d]) >>> 0; working[b] ^= working[c]; working[b] = ROTL(working[b], 12) >>> 0;
            working[a] = (working[a] + working[b]) >>> 0; working[d] ^= working[a]; working[d] = ROTL(working[d], 8) >>> 0;
            working[c] = (working[c] + working[d]) >>> 0; working[b] ^= working[c]; working[b] = ROTL(working[b], 7) >>> 0;
            // diagonal rounds
            // (0,5,10,15)
            a = 0; b = 5; c = 10; d = 15;
            working[a] = (working[a] + working[b]) >>> 0; working[d] ^= working[a]; working[d] = ROTL(working[d], 16) >>> 0;
            working[c] = (working[c] + working[d]) >>> 0; working[b] ^= working[c]; working[b] = ROTL(working[b], 12) >>> 0;
            working[a] = (working[a] + working[b]) >>> 0; working[d] ^= working[a]; working[d] = ROTL(working[d], 8) >>> 0;
            working[c] = (working[c] + working[d]) >>> 0; working[b] ^= working[c]; working[b] = ROTL(working[b], 7) >>> 0;
            // (1,6,11,12)
            a = 1; b = 6; c = 11; d = 12;
            working[a] = (working[a] + working[b]) >>> 0; working[d] ^= working[a]; working[d] = ROTL(working[d], 16) >>> 0;
            working[c] = (working[c] + working[d]) >>> 0; working[b] ^= working[c]; working[b] = ROTL(working[b], 12) >>> 0;
            working[a] = (working[a] + working[b]) >>> 0; working[d] ^= working[a]; working[d] = ROTL(working[d], 8) >>> 0;
            working[c] = (working[c] + working[d]) >>> 0; working[b] ^= working[c]; working[b] = ROTL(working[b], 7) >>> 0;
            // (2,7,8,13)
            a = 2; b = 7; c = 8; d = 13;
            working[a] = (working[a] + working[b]) >>> 0; working[d] ^= working[a]; working[d] = ROTL(working[d], 16) >>> 0;
            working[c] = (working[c] + working[d]) >>> 0; working[b] ^= working[c]; working[b] = ROTL(working[b], 12) >>> 0;
            working[a] = (working[a] + working[b]) >>> 0; working[d] ^= working[a]; working[d] = ROTL(working[d], 8) >>> 0;
            working[c] = (working[c] + working[d]) >>> 0; working[b] ^= working[c]; working[b] = ROTL(working[b], 7) >>> 0;
            // (3,4,9,14)
            a = 3; b = 4; c = 9; d = 14;
            working[a] = (working[a] + working[b]) >>> 0; working[d] ^= working[a]; working[d] = ROTL(working[d], 16) >>> 0;
            working[c] = (working[c] + working[d]) >>> 0; working[b] ^= working[c]; working[b] = ROTL(working[b], 12) >>> 0;
            working[a] = (working[a] + working[b]) >>> 0; working[d] ^= working[a]; working[d] = ROTL(working[d], 8) >>> 0;
            working[c] = (working[c] + working[d]) >>> 0; working[b] ^= working[c]; working[b] = ROTL(working[b], 7) >>> 0;
        }

        for (let i = 0; i < 16; i++) {
            const v = (working[i] + state[i]) >>> 0;
            U32TO8_LE(out, i * 4, v);
        }
        return out;
    }

    // Produce Poly1305 one-time key by running ChaCha20 with counter=0
    const otk = chacha20Block(key, 0, nonce).slice(0, 32);

    // Poly1305 implementation (BigInt-based)
    const P = (1n << 130n) - 5n;

    function leBytesToBigInt(b: Uint8Array<ArrayBuffer>, off: number, len: number) {
        let v = 0n;
        for (let i = 0; i < len; i++) {
            v |= BigInt(b[off + i]) << BigInt(8 * i);
        }
        return v;
    }

    // clamp r
    const rbytes = otk.slice(0, 16);
    rbytes[3] &= 15; rbytes[7] &= 15; rbytes[11] &= 15; rbytes[15] &= 15;
    rbytes[4] &= 252; rbytes[8] &= 252; rbytes[12] &= 252;
    const r = leBytesToBigInt(rbytes, 0, 16);
    const s = leBytesToBigInt(otk, 16, 16);

    // Build mac data: aad || pad || ct || pad || le64(aadLen) || le64(ctLen)
    function pad16(len: number) { return (16 - (len % 16)) % 16; }
    const aadLen = aad ? aad.length : 0;
    const ctLen = ciphertext.length;
    const macLen = aadLen + pad16(aadLen) + ctLen + pad16(ctLen) + 16; // last 16 for lengths
    const macData = new Uint8Array(macLen);
    let off = 0;
    if (aadLen > 0) { macData.set(aad as Uint8Array<ArrayBuffer>, off); off += aadLen; }
    off += pad16(aadLen);
    macData.set(ciphertext as Uint8Array<ArrayBuffer>, off); off += ctLen;
    off += pad16(ctLen);
    // le64(aadLen)
    for (let i = 0; i < 8; i++) macData[off + i] = (aadLen >>> (8 * i)) & 0xff;
    // le64(ctLen)
    for (let i = 0; i < 8; i++) macData[off + 8 + i] = (ctLen >>> (8 * i)) & 0xff;

    // compute Poly1305 tag
    let acc = 0n;
    let idx = 0;
    while (idx < macData.length - 16) {
        const blockLen = Math.min(16, macData.length - 16 - idx);
        const n = leBytesToBigInt(macData, idx, blockLen) + (1n << BigInt(8 * blockLen));
        acc = ((acc + n) * r) % P;
        idx += blockLen;
    }
    // add s and reduce to 128-bit
    const tagNum = (acc + s) & ((1n << 128n) - 1n);
    const computedTag = new Uint8Array(16);
    let tmp = tagNum;
    for (let i = 0; i < 16; i++) {
        computedTag[i] = Number(tmp & 0xffn);
        tmp >>= 8n;
    }

    // constant-time compare
    if (computedTag.length !== tag.length) throw new Error('Authentication failed');
    let diff = 0;
    for (let i = 0; i < 16; i++) diff |= computedTag[i] ^ tag[i];
    if (diff !== 0) throw new Error('ChaCha20-Poly1305 authentication failed');

    // decrypt: keystream with counter starting at 1
    const out = new Uint8Array(ctLen);
    let counter = 1;
    let pos = 0;
    while (pos < ctLen) {
        const block = chacha20Block(key, counter, nonce);
        const chunk = Math.min(64, ctLen - pos);
        for (let i = 0; i < chunk; i++) out[pos + i] = ciphertext[pos + i] ^ block[i];
        pos += chunk; counter++;
    }

    return out as Uint8Array<ArrayBuffer>;
}

/**
 * Generates an MD5 hash of the provided data.
 *
 * @param data - The input byte array to hash.
 * @returns A `Uint8Array` containing the 16-byte MD5 hash.
 */
export function MD5(data: Uint8Array): Uint8Array<ArrayBuffer> {
    // Standard MD5 block constants and transformation logic
    function safeAdd(x: number, y: number): number {
        const lsw = (x & 0xffff) + (y & 0xffff);
        const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return msw << 16 | lsw & 0xffff;
    }
    function bitRotateLeft(num: number, cnt: number): number {
        return num << cnt | num >>> 32 - cnt;
    }
    function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
        return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
    }
    function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
        return md5cmn(b & c | ~b & d, a, b, x, s, t);
    }
    function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
        return md5cmn(b & d | c & ~d, a, b, x, s, t);
    }
    function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
        return md5cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
        return md5cmn(c ^ (b | ~d), a, b, x, s, t);
    }

    // Convert Uint8Array to little-endian 32-bit words
    const nBytes = data.length;
    const nWords = ((nBytes + 8 >> 6) + 1) * 16;
    const x = new Int32Array(nWords);
    for (let i = 0; i < nBytes; i++) {
        x[i >> 2] |= (data[i] & 0xff) << i % 4 * 8;
    }
    x[nBytes >> 2] |= 0x80 << nBytes % 4 * 8;
    x[nWords - 2] = nBytes * 8;

    let a = 1732584193;
    let b = -271733879;
    let c = -1732584194;
    let d = 271733878;

    for (let i = 0; i < x.length; i += 16) {
        const oldA = a, oldB = b, oldC = c, oldD = d;

        // Round 1 (FF)
        a = md5ff(a, b, c, d, x[i], 7, -680876936);
        d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
        b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);

        // Round 2 (GG)
        a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = md5gg(b, c, d, a, x[i], 20, -373897302);
        a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);

        // Round 3 (HH)
        a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
        d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = md5hh(d, a, b, c, x[i], 11, -358537222);
        c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);

        // Round 4 (II)
        a = md5ii(a, b, c, d, x[i], 6, -198630844);
        d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);

        a = safeAdd(a, oldA);
        b = safeAdd(b, oldB);
        c = safeAdd(c, oldC);
        d = safeAdd(d, oldD);
    }

    // Convert state words to a little-endian Uint8Array (16 bytes)
    const result = new Uint8Array(16);
    const words = [a, b, c, d];
    for (let i = 0; i < 4; i++) {
        const w = words[i];
        result[i * 4] = w & 0xff;
        result[i * 4 + 1] = w >> 8 & 0xff;
        result[i * 4 + 2] = w >> 16 & 0xff;
        result[i * 4 + 3] = w >>> 24 & 0xff;
    }
    return result;
}
