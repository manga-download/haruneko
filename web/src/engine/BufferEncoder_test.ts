import { describe, it, expect } from 'vitest';
import * as testee from './BufferEncoder';

/* eslint-disable-next-line no-restricted-properties */ //=> This test is supposed to run in NodeJS environment where Buffer is available
global.atob = (encoded: string) => Buffer.from(encoded, 'base64').toString('utf-8');

describe('BufferEncoder', () => {

    describe('GetBytesFromHex()', () => {

        it.each([
            [ '', [] ],
            [ '2D', [ 0x2D ] ],
            [ '5374617920F09F988E20696E2074686520E29880EFB88F', [
                0x53, 0x74, 0x61, 0x79, 0x20, 0xF0, 0x9F, 0x98,
                0x8E, 0x20, 0x69, 0x6E, 0x20, 0x74, 0x68, 0x65,
                0x20, 0xE2, 0x98, 0x80, 0xEF, 0xB8, 0x8F,
            ] ],
        ])('Should get bytes from valid input', (input: string, expected: number[]) => {
            const actualUpper = testee.GetBytesFromHex(input.toUpperCase());
            expect(actualUpper).toStrictEqual(new Uint8Array(expected));
            const actualLower = testee.GetBytesFromHex(input.toLowerCase());
            expect(actualLower).toStrictEqual(new Uint8Array(expected));
        });

        it.each([
            undefined,
            null,
            true,
            'XX',
            '8',
            {},
            ['-'],
            3,
        ])('Should throw on invalid input', (input: unknown) => {
            expect(() => testee.GetBytesFromHex(input as string)).toThrow();
        });
    });

    describe('GetHexFromBytes()', () => {

        it.each([
            [ [], '' ],
            [ [ 0x2D ], '2D' ],
            [ [
                0x53, 0x74, 0x61, 0x79, 0x20, 0xF0, 0x9F, 0x98,
                0x8E, 0x20, 0x69, 0x6E, 0x20, 0x74, 0x68, 0x65,
                0x20, 0xE2, 0x98, 0x80, 0xEF, 0xB8, 0x8F,
            ], '5374617920F09F988E20696E2074686520E29880EFB88F' ],
        ])('Should get hex from valid input', (input: number[], expected: string) => {
            const actual = testee.GetHexFromBytes(new Uint8Array(input));
            expect(actual).toBe(expected.toLowerCase());
        });

        it.each([
            undefined,
            null,
            true,
            '-',
            {},
            ['-'],
            3,
        ])('Should throw on invalid input', (input: unknown) => {
            expect(() => testee.GetHexFromBytes(input as Uint8Array)).toThrow();
        });
    });

    describe('GetBytesFromUTF8()', () => {

        it.each([
            [ '', [] ],
            [ '-', [ 0x2D ] ],
            [ 'Stay 😎 in the ☀️', [
                0x53, 0x74, 0x61, 0x79, 0x20, 0xF0, 0x9F, 0x98,
                0x8E, 0x20, 0x69, 0x6E, 0x20, 0x74, 0x68, 0x65,
                0x20, 0xE2, 0x98, 0x80, 0xEF, 0xB8, 0x8F,
            ] ],
        ])('Should get bytes from valid input', (input: string, expected: number[]) => {
            const actual = testee.GetBytesFromUTF8(input);
            // NOTE: In some vitest environments (e.g., JSDOM) the Uint8Array constructor used by TextEncoder differs from the global constructor,
            //       therfore the constructor is patched to ensure consistent assertions (see: https://github.com/jestjs/jest/issues/9204)
            const ctor = actual['constructor'] as Uint8ArrayConstructor;
            expect(actual).toStrictEqual(new ctor(expected));
        });

        it.each([
            undefined,
            null,
            true,
            {},
            ['-'],
            3,
        ])('Should throw on invalid input', (input: unknown) => {
            expect(() => testee.GetBytesFromUTF8(input as string)).toThrow();
        });
    });

    describe('GetBytesFromBase64()', () => {

        it.each([
            [ '', [] ],
            [ 'LQ==', [ 0x2D ] ],
            [ 'PDw/Pz8+Pg==', [ 0x3C, 0x3C, 0x3F, 0x3F, 0x3F, 0x3E, 0x3E ] ],
            [ 'PD\rw/Pz8+\nPg ==', [ 0x3C, 0x3C, 0x3F, 0x3F, 0x3F, 0x3E, 0x3E ] ],
        ])('Should get bytes from valid input', (input: string, expected: number[]) => {
            const actual = testee.GetBytesFromBase64(input);
            expect(actual).toStrictEqual(new Uint8Array(expected));
        });

        it.each([
            undefined,
            null,
            true,
            'X==',
            'PDw_Pz8-Pg==',
            {},
            ['-'],
            3,
        ])('Should throw on invalid input', (input: unknown) => {
            expect(() => testee.GetBytesFromBase64(input as string)).toThrow();
        });
    });

    describe('GetBase64FromBytes', () => {

        it.each([
            [ [], '' ],
            [ [ 0x2D ], 'LQ==' ],
            [ [ 0x3C, 0x3C, 0x3F, 0x3F, 0x3F, 0x3E, 0x3E ], 'PDw/Pz8+Pg==' ],
        ])('Should get base64 from valid input', (input: number[], expected: string) => {
            const actual = testee.GetBase64FromBytes(new Uint8Array(input));
            expect(actual).toStrictEqual(expected);
        });

        it.each([
            undefined,
            null,
            true,
            '-',
            {},
            ['-'],
            3,
        ])('Should throw on invalid input', (input: unknown) => {
            expect(() => testee.GetBase64FromBytes(input as Uint8Array)).toThrow();
        });
    });
});