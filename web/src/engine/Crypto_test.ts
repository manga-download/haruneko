import { describe, expect, it } from 'vitest';
import { GetBytesFromUTF8, GetHexFromBytes, GetBytesFromHex } from './BufferEncoder';
import * as testee from './Crypto';

// TODO: ⚠️ Use constant expected values instead of using business logic to calculate expected values

describe('Hashing', () => {

    it('Should properly hash a string using SHA-256', async () => {
        const hash = await testee.HashUTF8('SHA-256', 'abc');
        expect(GetHexFromBytes(hash)).toBe('ba7816bf8f01cfea414140de5dae2223' + 'b00361a396177a9cb410ff61f20015ad');
    });

    it('Should properly hash a string using SHA-512', async () => {
        const hash = await testee.HashUTF8('SHA-512', 'abc');
        expect(GetHexFromBytes(hash)).toBe('ddaf35a193617abacc417349ae204131' + '12e6fa4e89a97ea20a9eeee64b55d39a' + '2192992a274fc1a836ba3c23a3feebbd' + '454d4423643ce80e2a9ac94fa54ca49f');
    });
});

describe('Xor', () => {
    it('should XOR source with key', () => {
        const result = testee.Xor(new Uint8Array([0xff, 0x00, 0xaa, 0x55]), new Uint8Array([0x0f, 0xf0]));
        expect(Array.from(result)).toEqual([0xf0, 0xf0, 0xa5, 0xa5]);
    });

    it('should XOR source with repeated key', () => {
        const result = testee.Xor(new Uint8Array([1, 2, 3, 4, 5]), new Uint8Array([1]));
        expect(Array.from(result)).toEqual([0, 3, 2, 5, 4]);
    });

    it('should XOR text source with repeated key', () => {
        const result = testee.XorUTF8('ABC', new Uint8Array([0xff]));
        expect(Array.from(result)).toEqual([65 ^ 0xff, 66 ^ 0xff, 67 ^ 0xff]);
    });
});

describe('AESEncrypt & AESDecrypt', () => {
    describe('AES-CBC', () => {

        it('decrypts AES-128-CBC (WebCrypto/PKCS#7) (self-test with known values)', async () => {
            const key = GetBytesFromHex('2b7e151628aed2a6abf7158809cf4f3c');
            const iv = GetBytesFromHex('000102030405060708090a0b0c0d0e0f');
            const ciphertext = GetBytesFromHex('7649abac8119b246cee98e9b12e9197d' + '8964e0b149c10b7b682e6e39aaeb731c');

            const decrypted = new Uint8Array(await testee.DecryptAES(ciphertext, key, { name: 'AES-CBC', iv }),);
            expect(decrypted).toEqual(GetBytesFromHex('6bc1bee22e409f96e93d7e117393172a'),);
        });

        it('decrypts AES-256-CBC (WebCrypto/PKCS#7) (self-test with known values)', async () => {
            const key = GetBytesFromHex('603deb1015ca71be2b73aef0857d77811f352c073b6108d72d9810a30914dff4');
            const iv = GetBytesFromHex('000102030405060708090a0b0c0d0e0f');
            const ciphertext = GetBytesFromHex('f58c4c04d6e5f1ba779eabfb5f7bfbd6485a5c81519cf378fa36d42b8547edc0');

            //compare against Webcrypto values and not NIST (Webcrypto forces padding)
            const cryptokey = await crypto.subtle.importKey('raw', key, { name: 'AES-CBC' }, false, ['decrypt']);
            const expected = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-CBC', iv }, cryptokey, ciphertext));

            const decrypted = new Uint8Array(await testee.DecryptAES(ciphertext, key, { name: 'AES-CBC', iv }));
            expect(decrypted).toEqual(expected);
        });
    });

    describe('AES-GCM', () => {

        it('decrypts using the NIST AES-128-GCM test vector', async () => {
            const key = GetBytesFromHex('00000000000000000000000000000000');
            const iv = GetBytesFromHex('000000000000000000000000');
            const ciphertext = GetBytesFromHex('58e2fccefa7e3061367f1d57a4e7455a');

            const decrypted = new Uint8Array(await testee.DecryptAES(ciphertext.buffer, key, { name: 'AES-GCM', iv, tagLength: 128 }));
            expect(decrypted).toEqual(new Uint8Array());
        });

        it('decrypts using the NIST AES-256-GCM test vector', async () => {
            const key = GetBytesFromHex('0000000000000000000000000000000000000000000000000000000000000000');
            const iv = GetBytesFromHex('000000000000000000000000');
            const ciphertext = GetBytesFromHex('530f8afbc74536b9a963b4f1c4cb738b');

            const decrypted = new Uint8Array(await testee.DecryptAES(ciphertext.buffer, key, { name: 'AES-GCM', iv, tagLength: 128 }));
            expect(decrypted).toEqual(new Uint8Array());
        });
    });
});

describe('HMAC', () => {
    it('HMAC-SHA256 RFC 4231 vector', async () => {
        const key = new Uint8Array(20).fill(0x0b);
        const message = GetBytesFromUTF8('Hi There');
        const signature = await testee.HMACSign(message, key, 'SHA-256');
        expect(GetHexFromBytes(new Uint8Array(signature))).toBe('b0344c61d8db38535ca8afceaf0bf12b' + '881dc200c9833da726e9376c2e32cff7');
    });

    it('HMACSignWithKey matches HMACSign', async () => {
        const keyData = GetBytesFromUTF8('secret');
        const key = await testee.HMACImportKey(keyData, 'SHA-256');
        const message = GetBytesFromUTF8('hello');
        const sig1 = await testee.HMACSign(message, keyData, 'SHA-256');
        const sig2 = await testee.HMACSignWithKey(message, key);
        expect(GetHexFromBytes(new Uint8Array(sig1))).toBe(GetHexFromBytes(new Uint8Array(sig2)));
    });
});