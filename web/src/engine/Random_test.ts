import { describe, it, expect } from 'vitest';
import { FisherYates, type PseudoRNG } from './Random';
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

    describe('LCG', () => {

        it.each([
            [0, undefined, undefined, undefined, 3, [1013904223, 1196435762, 3519870697]],
            [3, undefined, undefined, 2**16, 5, [9606, 16173, 5800, 2535, 32282]],
            [3, undefined, undefined, undefined, 5, [1018897798, 2365144877, 3752335016, 3345418727, 1647017498]],
            [3, 25214903917, 11, undefined, 5, [2630267730, 2974679040, 2453012480, 3304980480, 338034688]],
        ])('Should generate expected numbers', (seed, multiplier, increment, modulo, repetitions, expected) => {
            const prng = testee.LCG(seed, multiplier, increment, modulo);
            const actual = Array.from({ length: repetitions }, () => prng.next().value);
            expect(actual).toStrictEqual(expected);
        });
    });

    describe('FisherYates::Shuffle', () => {

        it('Should create expected sequence with index derivation', () => {
            const mockDeriveIndex = (index: number) => [0, 1, 2, 2, 1, 0][index];
            const actual = new FisherYates(mockDeriveIndex).Shuffle('A', 'B', 'C', 'D', 'E', 'F');
            expect(actual).toStrictEqual(['F', 'E', 'D', 'C', 'B', 'A']);
        });

        it('Should create expected sequence with scaled PRNG', () => {
            const mockPRNG = (function* () { yield* [0.1, 0.3, 0.5, 0.9, 0.6, 0.3]; })();
            const actual = FisherYates.WithScaledDerivation(mockPRNG as PseudoRNG).Shuffle('A', 'B', 'C', 'D', 'E', 'F');
            expect(actual).toStrictEqual(['F', 'E', 'D', 'C', 'B', 'A']);
        });

        it('Should create expected sequence with modulo PRNG', () => {
            const mockPRNG = (function* () { yield* [0, 1, 2, 2, 1, 0]; })();
            const actual = FisherYates.WithModuloDerivation(mockPRNG as PseudoRNG).Shuffle('A', 'B', 'C', 'D', 'E', 'F');
            expect(actual).toStrictEqual(['F', 'E', 'D', 'C', 'B', 'A']);
        });

        it.each([
            FisherYates.WithScaledDerivation,
            FisherYates.WithModuloDerivation,
        ])('Should ba able to continue consumption from the provided PRNG', (activator) => {
            const mockPRNG = (function* () { yield* [0, 0, 3, 7, 11]; })();
            activator(mockPRNG as PseudoRNG).Shuffle('😇', '😈');
            const actual = Array.from({ length: 3 }, () => mockPRNG.next().value);
            expect(actual).toStrictEqual([3, 7, 11]);
        });
    });
});