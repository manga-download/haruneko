import { describe, it, expect } from 'vitest';
import { SanitizeFileName } from './StorageController';

describe('StorageController', () => {

    describe('SanitizeFileName', () => {

        it('Should strip characters of unicode category control', () => {
            expect(SanitizeFileName(String.fromCodePoint(
                ...Array.from({ length: 0x20 }, (_, index) => 0x0000 + index),
                0x007F,
                ...Array.from({ length: 0x20 }, (_, index) => 0x0080 + index),
            ))).toBe('untitled');
        });

        it('Should strip characters of unicode category format', () => {
            expect(SanitizeFileName(String.fromCodePoint(
                0x00AD, 0x0600, 0x0601, 0x0602, 0x0603, 0x0604, 0x061C, 0x06DD,
                0x070F, 0x08E2, 0x180E, 0x200B, 0x200C, 0x200D, 0x200E, 0x200F,
                0x202A, 0x202B, 0x202C, 0x202D, 0x202E, 0x2060, 0x2061, 0x2062,
                0x2063, 0x2064, 0x2066, 0x2067, 0x2068, 0x2069, 0xFE00, 0xFE01,
                0xFE02, 0xFE03, 0xFE04, 0xFE05, 0xFE06, 0xFE07, 0xFE08, 0xFE09,
                0xFE0A, 0xFE0B, 0xFE0C, 0xFE0D, 0xFE0E, 0xFE0F, 0xFEFF,
                0xE0001, ...Array.from({ length: 0x60 }, (_, index) => 0xE0020 + index)
            ))).toBe('untitled');
        });

        it('Should replace invalid filename characters', () => {
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
    });
});