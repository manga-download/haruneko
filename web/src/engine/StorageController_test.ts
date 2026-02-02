import { describe, it, expect } from 'vitest';
import { SanitizeFileName } from './StorageController';

describe('StorageController', () => {

    describe('SanitizeFileName', () => {

        it('Should replace forbidden characters', () => {
            expect(SanitizeFileName('\u200b< > : " / \\ | ? * ~')).toBe('＜ ＞ ꞉ ＂ ／ ＼ ｜ ？ ＊ ～');
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