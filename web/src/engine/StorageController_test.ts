import { describe, it, expect } from 'vitest';
import { SanitizeFileName } from './StorageController';

describe('StorageController', () => {

    describe('SanitizeFileName', () => {

        it('Should replace forbidden characters', () => {
            expect(SanitizeFileName('< > : " / \\ | ? * ~')).toBe('＜ ＞ ꞉ ＂ ／ ＼ ｜ ？ ＊ ～');
        });

        it.each([
            ['😎.', '😎․'],
            ['😎..', '😎․․'],
            ['😎...', '😎․․․'],
            ['😎 . .. ', '😎 . ․․'],
            ['😎 .. . ', '😎 .. ․'],
        ])('Should replace trailing dots', (input, expected) => {
            expect(SanitizeFileName(input)).toBe(expected);
        });

        it.each([
            ['.😎', '.😎'],
            ['..😎', '․․😎'],
            ['...😎', '․․․😎'],
            [' .. . 😎', '․․ . 😎'],
            [' . .. 😎', '. .. 😎'],
        ])('Should replace leading dots', (input, expected) => {
            expect(SanitizeFileName(input)).toBe(expected);
        });

        it('Should not modify short filenames', () => {
            const shortName = 'Short filename';
            const result = SanitizeFileName(shortName);
            expect(result).toBe(shortName);
        });

        it('Should use hash suffix for long filenames to preserve uniqueness', () => {
            const longName = 'a'.repeat(250);
            const result = SanitizeFileName(longName);
            expect(result.length).toBeLessThanOrEqual(80);
            expect(result).toContain('_'); // Should contain separator
            // Verify it's unique by checking different long names produce different results
            const longName2 = 'b'.repeat(250);
            const result2 = SanitizeFileName(longName2);
            expect(result).not.toBe(result2);
        });

        it('Should use custom max length with hash suffix', () => {
            const longName = 'Test '.repeat(50); // 250 characters
            const result = SanitizeFileName(longName, 50);
            expect(result.length).toBeLessThanOrEqual(50);
            expect(result).toContain('_'); // Should contain separator before hash
        });

        it('Should handle very long manga/chapter titles with hash (Windows path limit issue)', () => {
            // Simulate the reported issue with very long manga titles
            const longMangaTitle = 'Shinjiteita Nakamatachi ni Dungeon Okuchi de Korosarekaketa ga Gift "Mugen Gacha" de Level 9999 no Nakamatachi o Te ni Irete Moto Party Member to Sekai ni Fukushuu & "Zamaa!" Shimasu!';
            const result = SanitizeFileName(longMangaTitle);
            expect(result.length).toBeLessThanOrEqual(80);
            // Should preserve the beginning of the title for readability
            expect(result).toContain('Shinjiteita Nakamatachi');
            // Should have a hash suffix for uniqueness
            expect(result).toContain('_');
        });

        it('Should prevent collisions for titles with same prefix but different suffixes', () => {
            // Two titles that share the same 80-character prefix but differ later
            const commonPrefix = 'a'.repeat(70);
            const title1 = commonPrefix + ' Part 1 Extra Content That Makes It Different';
            const title2 = commonPrefix + ' Part 2 Extra Content That Makes It Different';
            const result1 = SanitizeFileName(title1, 80);
            const result2 = SanitizeFileName(title2, 80);
            // Even though they share the same prefix, the hash should be different
            expect(result1).not.toBe(result2);
        });

        it('Should preserve uniqueness with hash suffix for similar long names', () => {
            const name1 = 'Very Long Manga Title That Exceeds The Limit Part 1 Chapter 1 Volume 1';
            const name2 = 'Very Long Manga Title That Exceeds The Limit Part 2 Chapter 1 Volume 1';
            const result1 = SanitizeFileName(name1, 50);
            const result2 = SanitizeFileName(name2, 50);
            expect(result1).not.toBe(result2); // Different hashes ensure uniqueness
        });

        it('Should handle Unicode characters in long names with hash', () => {
            const unicodeName = '😀'.repeat(100) + 'test';
            const result = SanitizeFileName(unicodeName, 50);
            expect(result.length).toBeLessThanOrEqual(50);
            expect(result).toContain('_'); // Should have hash suffix
        });

        it('Should trim trailing spaces before adding hash', () => {
            const nameWithSpaces = 'a'.repeat(75) + '     ' + 'b'.repeat(10);
            const result = SanitizeFileName(nameWithSpaces, 80);
            // The underscore separator should not be preceded by a space
            const parts = result.split('_');
            expect(parts[0].endsWith(' ')).toBe(false);
        });
    });
});