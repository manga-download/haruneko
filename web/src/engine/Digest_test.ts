import { describe, it, expect } from 'vitest';
import * as Hash from './Digest';

describe('Digest', () => {

    describe('DJB2', () => {

        it('Should calculate expected checksum', () => {
            const actual = Hash.DJB2('Meow!').toString(16).toUpperCase().padStart(8, '0');
            expect(actual).toBe('05E65734'); // 05E65734 => https://md5hashing.net/hash/djb2
        });
    });

    describe('SDBM', () => {

        it('Should calculate expected checksum', () => {
            const actual = Hash.SDBM('Meow!').toString(16).toUpperCase().padStart(8, '0');
            expect(actual).toBe('99311A01'); // 99311A01 => https://md5hashing.net/hash/sdbm
        });
    });

    describe('FNV1A', () => {

        it('Should calculate expected checksum', () => {
            const actual = Hash.FNV1A('Meow!').toString(16).toUpperCase().padStart(8, '0');
            expect(actual).toBe('C7B5DDF4'); // C7B5DDF4 => https://md5hashing.net/hash/fnv1a32
        });
    });
});