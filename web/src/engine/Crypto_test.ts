import { describe, it, expect } from 'vitest';
import * as testee from './Crypto';
import { GetBytesFromHex, GetBytesFromUTF8 } from './BufferEncoder';

describe('Crypto', () => {
    describe('XOR()', () => {
        it.each([
            [
                new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07]),
                new Uint8Array([0xAA]),
                [0xAB, 0xA8, 0xA9, 0xAE, 0xAF, 0xAC, 0xAD]
            ],
            ['Hello World 👌', 'Hello World 👌', new Array(16).fill(0)]

        ])('should XOR source with key', (source: string | Uint8Array, key: string | Uint8Array, expected: number[]) => {
            expect(testee.XOR(source, key)).toStrictEqual(new Uint8Array(expected));
        });

        it.each([null, undefined])('should throw when key is missing (%p)', (key) => {
            expect(() => testee.XOR(new Uint8Array([1]), key as never)).toThrow("Incorrect Key parameter !");
        });

        it.each([null, undefined])('should throw when source is missing (%p)', (source) => {
            expect(() => testee.XOR(source as never, new Uint8Array([1]))).toThrow("Incorrect Source parameter !");
        });

        it('should throw when key is empty', () => {
            expect(() => testee.XOR(new Uint8Array([1]), new Uint8Array())).toThrow(RangeError);
            expect(() => testee.XOR(new Uint8Array([1]), new Uint8Array())).toThrow('Incorrect Key parameter !');
        });

        it.each([
            [new Uint8Array()],
            [''],
        ])('should throw when source is empty', (source) => {
            expect(() => testee.XOR(source, new Uint8Array([1]))).toThrow(RangeError);
            expect(() => testee.XOR(source, new Uint8Array([1]))).toThrow('Incorrect Source parameter !');
        });

        it.each([
            [new Uint8Array([1]), ''],
            [new Uint8Array([1]), new Uint8Array()],
        ])('should throw when key is empty', (source, key) => {
            expect(() => testee.XOR(source, key)).toThrow(RangeError);
            expect(() => testee.XOR(source, key)).toThrow('Incorrect Key parameter !');
        });
    });

    describe('SHA256()', () => {
        it.each([
            [
                '',
                [
                    0xe3, 0xb0, 0xc4, 0x42, 0x98, 0xfc, 0x1c, 0x14,
                    0x9a, 0xfb, 0xf4, 0xc8, 0x99, 0x6f, 0xb9, 0x24,
                    0x27, 0xae, 0x41, 0xe4, 0x64, 0x9b, 0x93, 0x4c,
                    0xa4, 0x95, 0x99, 0x1b, 0x78, 0x52, 0xb8, 0x55,
                ],
            ],
            [
                'abc',
                [
                    0xba, 0x78, 0x16, 0xbf, 0x8f, 0x01, 0xcf, 0xea,
                    0x41, 0x41, 0x40, 0xde, 0x5d, 0xae, 0x22, 0x23,
                    0xb0, 0x03, 0x61, 0xa3, 0x96, 0x17, 0x7a, 0x9c,
                    0xb4, 0x10, 0xff, 0x61, 0xf2, 0x00, 0x15, 0xad,
                ],
            ],
            [
                new Uint8Array([0x61, 0x62, 0x63]),
                [
                    0xba, 0x78, 0x16, 0xbf, 0x8f, 0x01, 0xcf, 0xea,
                    0x41, 0x41, 0x40, 0xde, 0x5d, 0xae, 0x22, 0x23,
                    0xb0, 0x03, 0x61, 0xa3, 0x96, 0x17, 0x7a, 0x9c,
                    0xb4, 0x10, 0xff, 0x61, 0xf2, 0x00, 0x15, 0xad,
                ],
            ],
        ])(
            'Should hash the source properly',
            async (input: string | BufferSource, expected: number[]) => {
                const actual = await testee.SHA256(input);
                expect(actual).toStrictEqual(new Uint8Array(expected).buffer);
            }
        );
    });

    describe('SHA512()', () => {
        it.each([
            [
                '',
                [
                    0xcf, 0x83, 0xe1, 0x35, 0x7e, 0xef, 0xb8, 0xbd,
                    0xf1, 0x54, 0x28, 0x50, 0xd6, 0x6d, 0x80, 0x07,
                    0xd6, 0x20, 0xe4, 0x05, 0x0b, 0x57, 0x15, 0xdc,
                    0x83, 0xf4, 0xa9, 0x21, 0xd3, 0x6c, 0xe9, 0xce,
                    0x47, 0xd0, 0xd1, 0x3c, 0x5d, 0x85, 0xf2, 0xb0,
                    0xff, 0x83, 0x18, 0xd2, 0x87, 0x7e, 0xec, 0x2f,
                    0x63, 0xb9, 0x31, 0xbd, 0x47, 0x41, 0x7a, 0x81,
                    0xa5, 0x38, 0x32, 0x7a, 0xf9, 0x27, 0xda, 0x3e,
                ],
            ],
            [
                'abc',
                [
                    0xdd, 0xaf, 0x35, 0xa1, 0x93, 0x61, 0x7a, 0xba,
                    0xcc, 0x41, 0x73, 0x49, 0xae, 0x20, 0x41, 0x31,
                    0x12, 0xe6, 0xfa, 0x4e, 0x89, 0xa9, 0x7e, 0xa2,
                    0x0a, 0x9e, 0xee, 0xe6, 0x4b, 0x55, 0xd3, 0x9a,
                    0x21, 0x92, 0x99, 0x2a, 0x27, 0x4f, 0xc1, 0xa8,
                    0x36, 0xba, 0x3c, 0x23, 0xa3, 0xfe, 0xeb, 0xbd,
                    0x45, 0x4d, 0x44, 0x23, 0x64, 0x3c, 0xe8, 0x0e,
                    0x2a, 0x9a, 0xc9, 0x4f, 0xa5, 0x4c, 0xa4, 0x9f,
                ],
            ],
            [
                new Uint8Array([0x61, 0x62, 0x63]),
                [
                    0xdd, 0xaf, 0x35, 0xa1, 0x93, 0x61, 0x7a, 0xba,
                    0xcc, 0x41, 0x73, 0x49, 0xae, 0x20, 0x41, 0x31,
                    0x12, 0xe6, 0xfa, 0x4e, 0x89, 0xa9, 0x7e, 0xa2,
                    0x0a, 0x9e, 0xee, 0xe6, 0x4b, 0x55, 0xd3, 0x9a,
                    0x21, 0x92, 0x99, 0x2a, 0x27, 0x4f, 0xc1, 0xa8,
                    0x36, 0xba, 0x3c, 0x23, 0xa3, 0xfe, 0xeb, 0xbd,
                    0x45, 0x4d, 0x44, 0x23, 0x64, 0x3c, 0xe8, 0x0e,
                    0x2a, 0x9a, 0xc9, 0x4f, 0xa5, 0x4c, 0xa4, 0x9f,
                ],
            ],
        ])('Should hash the source properly', async (input: string | BufferSource, expected: number[]) => {
            const actual = await testee.SHA512(input);
            expect(actual).toStrictEqual(new Uint8Array(expected).buffer);
        });
    });

    describe('HMAC256()', () => {
        it.each([
            [
                'Hi There',
                new Uint8Array(20).fill(0x0b),
                [
                    0xb0, 0x34, 0x4c, 0x61, 0xd8, 0xdb, 0x38, 0x53,
                    0x5c, 0xa8, 0xaf, 0xce, 0xaf, 0x0b, 0xf1, 0x2b,
                    0x88, 0x1d, 0xc2, 0x00, 0xc9, 0x83, 0x3d, 0xa7,
                    0x26, 0xe9, 0x37, 0x6c, 0x2e, 0x32, 0xcf, 0xf7
                ]
            ],
            [
                'what do ya want for nothing?',
                'Jefe',
                [
                    0x5b, 0xdc, 0xc1, 0x46, 0xbf, 0x60, 0x75, 0x4e,
                    0x6a, 0x04, 0x24, 0x26, 0x08, 0x95, 0x75, 0xc7,
                    0x5a, 0x00, 0x3f, 0x08, 0x9d, 0x27, 0x39, 0x83,
                    0x9d, 0xec, 0x58, 0xb9, 0x64, 0xec, 0x38, 0x43
                ]
            ],
        ])(
            'Should properly sign message',
            async (input: string, key: string | BufferSource, expected: number[]) => {
                const actual = await testee.HMAC256(input, key);
                expect(actual).toStrictEqual(new Uint8Array(expected).buffer);
            }
        );

        it.each([
            null,
            undefined,
        ])('Should throw on invalid key', async (key) => {
            await expect(testee.HMAC256('dummy', key as any)).rejects.toThrow();
        });
    });

    describe('AESEncrypt & AESDecrypt', () => {

        describe('AES-CBC', () => {
            it('encrypts AES-128-CBC (WebCrypto/PKCS#7)', async () => {
                const key = GetBytesFromHex('2b7e151628aed2a6abf7158809cf4f3c');
                const iv = GetBytesFromHex('000102030405060708090a0b0c0d0e0f');
                const plaintext = GetBytesFromHex('6bc1bee22e409f96e93d7e117393172a');

                const encrypted = new Uint8Array(await testee.AESEncrypt(plaintext.buffer, key, { mode: 'CBC', iv, }),);
                expect(encrypted).toEqual(GetBytesFromHex('7649abac8119b246cee98e9b12e9197d' + '8964e0b149c10b7b682e6e39aaeb731c'),);
            });

            it('decrypts AES-128-CBC (WebCrypto/PKCS#7)', async () => {
                const key = GetBytesFromHex('2b7e151628aed2a6abf7158809cf4f3c');
                const iv = GetBytesFromHex('000102030405060708090a0b0c0d0e0f');
                const ciphertext = GetBytesFromHex('7649abac8119b246cee98e9b12e9197d' + '8964e0b149c10b7b682e6e39aaeb731c');

                const decrypted = new Uint8Array(await testee.AESDecrypt(ciphertext.buffer, key, { mode: 'CBC', iv, }),);
                expect(decrypted).toEqual(GetBytesFromHex('6bc1bee22e409f96e93d7e117393172a'));
            });

            it('throws when IV is missing', async () => {
                const key = GetBytesFromUTF8('1234567890123456');
                const options: testee.AesOptions = { mode: 'CBC' };

                await expect(testee.AESEncrypt(GetBytesFromUTF8('test').buffer, key, options),).rejects.toThrow(TypeError);
                await expect(testee.AESDecrypt(new ArrayBuffer(16), key, options),).rejects.toThrow(TypeError);
            });

        });

        describe('AES-CTR', () => {

            it('encrypts using the NIST AES-128-CTR test vector', async () => {
                const key = GetBytesFromHex('2b7e151628aed2a6abf7158809cf4f3c');
                const counter = GetBytesFromHex('f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff');
                const plaintext = GetBytesFromHex('6bc1bee22e409f96e93d7e117393172a');
                const expected = GetBytesFromHex('874d6191b620e3261bef6864990db6ce');

                const encrypted = new Uint8Array(await testee.AESEncrypt(plaintext.buffer, key, { mode: 'CTR', counter, length: 128 }));
                expect(encrypted).toEqual(expected);
            });

            it('decrypts using the NIST AES-128-CTR test vector', async () => {
                const key = GetBytesFromHex('2b7e151628aed2a6abf7158809cf4f3c');
                const counter = GetBytesFromHex('f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff');
                const ciphertext = GetBytesFromHex('874d6191b620e3261bef6864990db6ce');
                const expected = GetBytesFromHex('6bc1bee22e409f96e93d7e117393172a');

                const decrypted = new Uint8Array(await testee.AESDecrypt(ciphertext.buffer, key, { mode: 'CTR', counter, length: 128 }));
                expect(decrypted).toEqual(expected);
            });

            it('uses a default counter length of 64 bits', async () => {
                const key = GetBytesFromUTF8('1234567890123456');
                const counter = new Uint8Array(16);
                const plaintext = GetBytesFromUTF8('Hello world');

                const ciphertext = await testee.AESEncrypt(plaintext.buffer, key, { mode: 'CTR', counter, });
                const decrypted = new Uint8Array(await testee.AESDecrypt(ciphertext, key, { mode: 'CTR', counter, }));
                expect(decrypted).toEqual(plaintext);
            });

            it('throws when counter is missing', async () => {
                const key = GetBytesFromUTF8('1234567890123456');
                const options: testee.AesOptions = { mode: 'CTR' };

                await expect(testee.AESEncrypt(GetBytesFromUTF8('test').buffer, key, options),).rejects.toThrow(TypeError);
                await expect(testee.AESDecrypt(new ArrayBuffer(16), key, options),).rejects.toThrow(TypeError);
            });

        });

        describe('AES-GCM', () => {

            it('encrypts using the NIST AES-128-GCM test vector', async () => {
                const key = GetBytesFromHex('00000000000000000000000000000000');
                const iv = GetBytesFromHex('000000000000000000000000');
                const plaintext = new Uint8Array();
                const expected = GetBytesFromHex('58e2fccefa7e3061367f1d57a4e7455a');

                const encrypted = new Uint8Array(await testee.AESEncrypt(plaintext.buffer, key, { mode: 'GCM', iv, tagLength: 128 }));
                expect(encrypted).toEqual(expected);
            });

            it('decrypts using the NIST AES-128-GCM test vector', async () => {
                const key = GetBytesFromHex('00000000000000000000000000000000');
                const iv = GetBytesFromHex('000000000000000000000000');
                const ciphertext = GetBytesFromHex('58e2fccefa7e3061367f1d57a4e7455a');

                const decrypted = new Uint8Array(await testee.AESDecrypt(ciphertext.buffer, key, { mode: 'GCM', iv, tagLength: 128 }));
                expect(decrypted).toEqual(new Uint8Array());
            });

            it('uses a default tag length of 128 bits', async () => {
                const key = GetBytesFromUTF8('1234567890123456');
                const iv = crypto.getRandomValues(new Uint8Array(12));
                const plaintext = GetBytesFromUTF8('Hello');

                const ciphertext = await testee.AESEncrypt(plaintext.buffer, key, { mode: 'GCM', iv });
                const decrypted = new Uint8Array(await testee.AESDecrypt(ciphertext, key, { mode: 'GCM', iv }));
                expect(decrypted).toEqual(plaintext);
            });

            it('throws when IV is missing', async () => {
                const key = GetBytesFromUTF8('1234567890123456');
                const options: testee.AesOptions = { mode: 'GCM' };

                await expect(testee.AESEncrypt(GetBytesFromUTF8('test').buffer, key, options)).rejects.toThrow(TypeError);
                await expect(testee.AESDecrypt(new ArrayBuffer(16), key, options)).rejects.toThrow(TypeError);
            });

        });

        it('accepts imported CryptoKeys', async () => {
            const rawKey = GetBytesFromUTF8('1234567890123456');
            const iv = crypto.getRandomValues(new Uint8Array(16));
            const plaintext = GetBytesFromUTF8('secret');

            const key = await crypto.subtle.importKey('raw', rawKey, 'AES-CBC', false, ['encrypt', 'decrypt']);
            const ciphertext = await testee.AESEncrypt(plaintext.buffer, key, { mode: 'CBC', iv });

            const decrypted = new Uint8Array(await testee.AESDecrypt(ciphertext, key, { mode: 'CBC', iv }));
            expect(decrypted).toEqual(plaintext);
        });
    });
});