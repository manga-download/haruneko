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

        it('Should truncate long filenames to default max length', () => {
            const longName = 'a'.repeat(250);
            const result = SanitizeFileName(longName);
            expect(result.length).toBeLessThanOrEqual(201); // 200 + ellipsis
            expect(result.endsWith('…')).toBe(true);
        });

        it('Should truncate long filenames to custom max length', () => {
            const longName = 'Test '.repeat(50); // 250 characters
            const result = SanitizeFileName(longName, 50);
            expect(result.length).toBeLessThanOrEqual(51); // 50 + ellipsis
            expect(result.endsWith('…')).toBe(true);
        });

        it('Should not truncate short filenames', () => {
            const shortName = 'Short filename';
            const result = SanitizeFileName(shortName);
            expect(result).toBe(shortName);
            expect(result.endsWith('…')).toBe(false);
        });

        it('Should handle very long manga/chapter titles (Windows path limit issue)', () => {
            // Simulate the reported issue with very long manga titles
            const longMangaTitle = 'Shinjiteita Nakamatachi ni Dungeon Okuchi de Korosarekaketa ga Gift "Mugen Gacha" de Level 9999 no Nakamatachi o Te ni Irete Moto Party Member to Sekai ni Fukushuu & "Zamaa!" Shimasu!';
            const result = SanitizeFileName(longMangaTitle);
            expect(result.length).toBeLessThanOrEqual(201); // 200 + ellipsis
            expect(result).toContain('Shinjiteita Nakamatachi');
        });

        it('Should handle Unicode characters when truncating', () => {
            const unicodeName = '😀'.repeat(100) + 'test';
            const result = SanitizeFileName(unicodeName, 50);
            expect(result.length).toBeLessThanOrEqual(51); // 50 + ellipsis
            expect(result.endsWith('…')).toBe(true);
        });

        it('Should trim trailing spaces before adding ellipsis', () => {
            const nameWithSpaces = 'a'.repeat(195) + '     ' + 'b'.repeat(10);
            const result = SanitizeFileName(nameWithSpaces, 200);
            expect(result.endsWith('…')).toBe(true);
            expect(result.charAt(result.length - 2)).not.toBe(' ');
        });
    });
});