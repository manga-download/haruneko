import { describe, it, expect } from 'vitest';
import * as Hash from './Digest';

describe('Digest', () => {

    describe('Hash32', () => {

        it.each([
            [Hash.Format.Dec, '', 0],
            [Hash.Format.Dec, 'Lorem + Ipsum = Dolor 😎', 0],
            [Hash.Format.Hex, '', ''],
            [Hash.Format.Hex, 'Lorem + Ipsum = Dolor 😎', ''],
            [Hash.Format.Alpha, '', ''],
            [Hash.Format.Alpha, 'Lorem + Ipsum = Dolor 😎', ''],
        ])('Should calculate expected checksum', (format, input, expected) => {
            const actual = Hash.Hash32(input, format);
            expect(actual).toBe(expected); // => https://md5hashing.net/hash/djb2
        });
    });

    describe('Hash64', () => {

        it.each([
            [Hash.Format.Dec, '', 0],
            [Hash.Format.Dec, 'Lorem + Ipsum = Dolor 😎', 0],
            [Hash.Format.Hex, '', ''],
            [Hash.Format.Hex, 'Lorem + Ipsum = Dolor 😎', ''],
            [Hash.Format.Alpha, '', ''],
            [Hash.Format.Alpha, 'Lorem + Ipsum = Dolor 😎', ''],
        ])('Should calculate expected checksum', (format, input, expected) => {
            const actual = Hash.Hash64(input, format);
            expect(actual).toBe(expected);
        });
    });
});