import { describe, it, expect } from 'vitest';
import * as testee from './Crypto';

describe('Crypto', () => {

    describe('XOR()', () => {
        it.each([
            [
                new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07]),
                new Uint8Array([0xAA]),
                [0xAB, 0xA8, 0xA9, 0xAE, 0xAF, 0xAC, 0xAD]
            ],
            [
                'Hello World 👌',
                'Hello World 👌',
                [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
            ]
        ])('Should get bytes from valid input', (input: string | Uint8Array, key: string | Uint8Array, expected: number[]) => {
            const actual = testee.XOR(input, key);
            expect(actual).toStrictEqual(new Uint8Array(expected));
        });

        it.each([
            null,
            undefined,
        ])('Should throw on invalid key', (key: unknown) => {
            expect(() => testee.XOR(new Uint8Array(0), key as Uint8Array)).toThrow();
        });
    });

    describe('SHA256()', () => {
        it.each([
            [
                `Hakuneko is awesome 🐈`,
                [
                    0x83, 0x15, 0x48, 0x13, 0x78, 0x54, 0x7b, 0x79,
                    0x0c, 0x3a, 0x46, 0xbd, 0x1e, 0xcb, 0x09, 0xfc,
                    0x9b, 0x41, 0xe8, 0x90, 0xd4, 0x0a, 0x2a, 0xeb,
                    0x49, 0x5f, 0x95, 0xa3, 0x10, 0x29, 0x47, 0x69,
                ]
            ],
            [
                new Uint8Array([
                    0x48, 0x61, 0x6b, 0x75, 0x6e, 0x65, 0x6b, 0x6f,
                    0x20, 0x69, 0x73, 0x20, 0x61, 0x77, 0x65, 0x73,
                    0x6f, 0x6d, 0x65, 0x20, 0xf0, 0x9f, 0x90, 0x88
                ]),
                [
                    0x83, 0x15, 0x48, 0x13, 0x78, 0x54, 0x7b, 0x79,
                    0x0c, 0x3a, 0x46, 0xbd, 0x1e, 0xcb, 0x09, 0xfc,
                    0x9b, 0x41, 0xe8, 0x90, 0xd4, 0x0a, 0x2a, 0xeb,
                    0x49, 0x5f, 0x95, 0xa3, 0x10, 0x29, 0x47, 0x69,
                ]
            ],
        ])('Should hash the source properly', async (input: string | BufferSource, expected: number[]) => {
            const actual = await testee.SHA256(input);
            expect(actual).toStrictEqual(new Uint8Array(expected).buffer);
        });
    });

    describe('SHA512()', () => {
        it.each([
            [
                `Hakuneko is awesome 🐈`,
                [
                    0x53, 0xD0, 0x52, 0xD4, 0x74, 0xCB, 0x1B, 0x88,
                    0x2F, 0x37, 0x64, 0x54, 0x72, 0x6F, 0x31, 0xDE,
                    0x75, 0xEA, 0x7A, 0x18, 0x80, 0x83, 0x7A, 0x6D,
                    0x7F, 0x1D, 0x71, 0x4D, 0xB8, 0xF9, 0x6B, 0x4E,
                    0xB1, 0xDF, 0x4B, 0xF3, 0xC4, 0xDB, 0x31, 0xA1,
                    0x2E, 0xA5, 0x4D, 0xBC, 0x6A, 0x15, 0x00, 0x43,
                    0x6D, 0xB0, 0x3A, 0x1F, 0x68, 0x24, 0x61, 0x39,
                    0x86, 0x78, 0xAA, 0x4D, 0xBA, 0x7F, 0xE3, 0xED
                ]
            ],
            [
                new Uint8Array([
                    0x48, 0x61, 0x6b, 0x75, 0x6e, 0x65, 0x6b, 0x6f,
                    0x20, 0x69, 0x73, 0x20, 0x61, 0x77, 0x65, 0x73,
                    0x6f, 0x6d, 0x65, 0x20, 0xf0, 0x9f, 0x90, 0x88
                ]),
                [
                    0x53, 0xD0, 0x52, 0xD4, 0x74, 0xCB, 0x1B, 0x88,
                    0x2F, 0x37, 0x64, 0x54, 0x72, 0x6F, 0x31, 0xDE,
                    0x75, 0xEA, 0x7A, 0x18, 0x80, 0x83, 0x7A, 0x6D,
                    0x7F, 0x1D, 0x71, 0x4D, 0xB8, 0xF9, 0x6B, 0x4E,
                    0xB1, 0xDF, 0x4B, 0xF3, 0xC4, 0xDB, 0x31, 0xA1,
                    0x2E, 0xA5, 0x4D, 0xBC, 0x6A, 0x15, 0x00, 0x43,
                    0x6D, 0xB0, 0x3A, 0x1F, 0x68, 0x24, 0x61, 0x39,
                    0x86, 0x78, 0xAA, 0x4D, 0xBA, 0x7F, 0xE3, 0xED
                ]
            ],
        ])('Should hash the source properly', async (input: string | BufferSource, expected: number[]) => {
            const actual = await testee.SHA512(input);
            expect(actual).toStrictEqual(new Uint8Array(expected).buffer);
        });
    });

    describe('HMAC256()', () => {
        it.each([
            [
                `Hakuneko is awesome 🐈`,
                `1337_h4xor_key`,
                [
                    0x3c, 0x8f, 0x08, 0x28, 0x7c, 0x3e, 0xc4, 0x55,
                    0x19, 0x86, 0x09, 0x1a, 0x7b, 0x84, 0x59, 0x76,
                    0x3c, 0x66, 0x39, 0x1f, 0xfa, 0x8c, 0xc4, 0x92,
                    0x9e, 0x41, 0xcd, 0xf6, 0xa4, 0xaa, 0xe0, 0xd2
                ]
            ],
            [
                `Hakuneko is awesome 🐈`,
                new Uint8Array([0x31, 0x33, 0x33, 0x37, 0x5F, 0x68, 0x34, 0x78, 0x6F, 0x72, 0x5F, 0x6B, 0x65, 0x79]),
                [
                    0x3c, 0x8f, 0x08, 0x28, 0x7c, 0x3e, 0xc4, 0x55,
                    0x19, 0x86, 0x09, 0x1a, 0x7b, 0x84, 0x59, 0x76,
                    0x3c, 0x66, 0x39, 0x1f, 0xfa, 0x8c, 0xc4, 0x92,
                    0x9e, 0x41, 0xcd, 0xf6, 0xa4, 0xaa, 0xe0, 0xd2
                ]
            ]
        ])('Should properly sign message', async (input: string, key: string | BufferSource, expected: number[]) => {
            const actual = await testee.HMAC256(input, key);
            expect(actual).toStrictEqual(new Uint8Array(expected).buffer);
        });

        it.each([
            null,
            undefined,
        ])('Should throw on invalid key', async (key) => {
            return expect(testee.HMAC256('dummy', key as any)).rejects.toThrow();
        });
    });

    describe('AESEncrypt & AESDecrypt', () => {
        const key = '1234567890123456'; // 16 bytes key for AES-128
        const message = 'Secret message for AES 🔒';

        it('Should encrypt and decrypt properly with CBC mode', async () => {
            const iv = new Uint8Array(16);
            const options: testee.AesOptions = { mode: 'CBC', iv };

            const ciphertext = await testee.AESEncrypt(message, key, options);
            const decrypted = await testee.AESDecrypt(ciphertext, key, options);

            const decoded = new TextDecoder().decode(decrypted);
            expect(decoded).toBe(message);
        });

        it('Should encrypt and decrypt properly with GCM mode', async () => {
            const iv = new Uint8Array(12); // Recommended 12 bytes for GCM
            const options: testee.AesOptions = { mode: 'GCM', iv, tagLength: 128 };

            const ciphertext = await testee.AESEncrypt(message, key, options);
            const decrypted = await testee.AESDecrypt(ciphertext, key, options);

            const decoded = new TextDecoder().decode(decrypted);
            expect(decoded).toBe(message);
        });

        it('Should encrypt and decrypt properly with CTR mode', async () => {
            const counter = new Uint8Array(16);
            const options: testee.AesOptions = { mode: 'CTR', counter, length: 64 };

            const ciphertext = await testee.AESEncrypt(message, key, options);
            const decrypted = await testee.AESDecrypt(ciphertext, key, options);

            const decoded = new TextDecoder().decode(decrypted);
            expect(decoded).toBe(message);
        });

        it('Should throw on missing required IV for CBC mode', async () => {
            const options: testee.AesOptions = { mode: 'CBC' };
            await expect(testee.AESEncrypt(message, key, options)).rejects.toThrow();
            await expect(testee.AESDecrypt(new ArrayBuffer(16), key, options)).rejects.toThrow();
        });

        it('Should throw on missing required counter for CTR mode', async () => {
            const options: testee.AesOptions = { mode: 'CTR' };
            await expect(testee.AESEncrypt(message, key, options)).rejects.toThrow();
            await expect(testee.AESDecrypt(new ArrayBuffer(16), key, options)).rejects.toThrow();
        });
    });
});