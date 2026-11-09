import { describe, it, expect } from 'vitest';
import * as testee from './Random';

/* eslint-disable-next-line no-restricted-properties */ //=> This test is supposed to run in NodeJS environment where Buffer is available
global.atob = (encoded: string) => Buffer.from(encoded, 'base64').toString('utf-8');

describe('Random', { repeats: 50 }, () => {

    describe('RandomFloat()', () => {

        it.each([
            [ -7.5, -3.5 ],
            [ -3.5, 7.5 ],
            [ -7.5, 3.5 ],
            [ 7.5, 19.5 ],
        ])('Should be in expected range', (min: number, max: number) => {
            const actual = testee.RandomFloat(min, max);
            expect(`${actual}`).toMatch(/^-?\d+\.\d+$/);
            expect(actual).toBeGreaterThanOrEqual(min);
            expect(actual).toBeLessThanOrEqual(max);
        });
    });

    describe('RandomInt()', () => {

        it.each([
            [ -7, -3 ],
            [ -3, 7 ],
            [ -7, 3 ],
            [ 7, 19 ],
        ])('Should be in expected range', (min: number, max: number) => {
            const actual = testee.RandomInt(min, max);
            expect(`${actual}`).toMatch(/^-?\d+$/);
            expect(actual).toBeGreaterThanOrEqual(min);
            expect(actual).toBeLessThanOrEqual(max);
        });
    });

    describe('RandomBytes()', () => {

        it.each([
            [ 3 ],
            [ 7 ],
            [ 32 ],
            [ 1000 ],
        ])('Should create valid data', (length: number) => {
            const actual = testee.RandomBytes(length);
            expect(actual.length).toBe(length);
        });
    });

    describe('RandomHex()', () => {

        it.each([
            [ 3 ],
            [ 7 ],
            [ 32 ],
            [ 1000 ],
        ])('Should create valid data', (length: number) => {
            const actual = testee.RandomHex(length);
            expect(`${actual}`).toMatch(/^[0-9A-F]+$/i);
            expect(actual.length).toBe(length);
        });
    });

    describe('RandomText()', () => {

        it.each([
            [ 3 ],
            [ 7 ],
            [ 32 ],
            [ 1000 ],
        ])('Should create valid data', (length: number) => {
            const actual = testee.RandomHex(length);
            expect(`${actual}`).toMatch(/^[0-9A-Z]+$/i);
            expect(actual.length).toBe(length);
        });
    });
});