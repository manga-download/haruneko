import { describe, it, expect } from 'vitest';
import { FisherYates } from './Random';
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

    describe('XorShift32', () => {
        it.each([
            [0, 3, [0, 0, 0]],
            [3, 5, [811107, 201886211, 3025432647, 1909268553, 1833517003]],
        ])('Should generate expected numbers', (seed, repetitions, expected) => {
            const prng = testee.XorShift32(seed);
            const actual = Array.from({ length: repetitions }, () => prng.next().value);
            expect(actual).toStrictEqual(expected);
        });
    });

    describe('FisherYates::Shuffle', () => {
        it.each([
            [0, ['B', 'C', 'D', 'E', 'F', 'A']],
            [3, ['C', 'E', 'A', 'F', 'B', 'D']],
            [7, ['C', 'B', 'E', 'F', 'A', 'D']],
        ])('Should create expected sequence', (seed, expected) => {
            const prng = testee.XorShift32(seed);
            const actual = new FisherYates(prng).Shuffle('A', 'B', 'C', 'D', 'E', 'F');
            expect(actual).toStrictEqual(expected);
        });
    });
});