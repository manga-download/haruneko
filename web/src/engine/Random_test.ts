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
            expect(actual).toStrictEqual(expected.map(int => ({ float: (int | 0) / 2**32, int })));
        });
    });

    describe('Mulberry32', () => {

        it.each([
            [0, [1144304738, 1416247, 958946056, 627933444, 2007157716]],
            [3, [3093350482, 166052715, 1959330548, 321813351, 3277083196]],
        ])('Should generate expected numbers', (seed, expected) => {
            const prng = testee.Mulberry32(seed);
            const actual = Array.from({ length: expected.length }, () => prng.next().value);
            expect(actual).toStrictEqual(expected.map(int => ({ float: int / 2**32, int })));
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
            expect(actual).toStrictEqual(expected.map(int => ({ float: int / 2**32, int })));
        });
    });

    describe('FisherYates::Shuffle', () => {

        function* mockPRNG(values: Array<{ float: number; int: number }>): PseudoRNG {
            yield* values;
            throw new Error('Mock PRNG exhausted');
        }

        it('Should create expected sequence with index derivation', () => {
            const indices: number[] = [];
            const mockDeriveIndex = (index: number) => {
                indices.push(index);
                return [0, 1, 2, 2, 1, 0][index];
            };
            const actual = new FisherYates(mockDeriveIndex).Shuffle('A', 'B', 'C', 'D', 'E', 'F');
            expect(actual).toStrictEqual(['F', 'E', 'D', 'C', 'B', 'A']);
            expect(indices).toStrictEqual([5, 4, 3, 2, 1]);
        });

        it('Should create expected sequence with scaled PRNG', () => {
            const rng = mockPRNG([0.1, 0.3, 0.5, 0.9, 0.6].map(float => ({ float, int: 0 })));
            const actual = FisherYates.WithScaledDerivation(rng).Shuffle('A', 'B', 'C', 'D', 'E', 'F');
            expect(actual).toStrictEqual(['F', 'E', 'D', 'C', 'B', 'A']);
        });

        it('Should create expected sequence with modulo PRNG', () => {
            const rng = mockPRNG([0, 1, 2, 2, 1].map(int => ({ float: 0, int })));
            const actual = FisherYates.WithModuloDerivation(rng).Shuffle('A', 'B', 'C', 'D', 'E', 'F');
            expect(actual).toStrictEqual(['F', 'E', 'D', 'C', 'B', 'A']);
        });

        it.each([
            FisherYates.WithScaledDerivation,
            FisherYates.WithModuloDerivation,
        ])('Should be able to continue consumption from the provided PRNG', (activator) => {
            const values = [0, 3, 7, 11].map(int => ({ float: int / 16, int }));
            const rng = mockPRNG(values);
            const shuffle = activator(rng);
            expect(shuffle.Shuffle()).toStrictEqual([]);
            expect(shuffle.Shuffle('😇')).toStrictEqual(['😇']);
            expect(shuffle.Shuffle('😇', '😈')).toStrictEqual(['😈', '😇']);
            const actual = Array.from({ length: 3 }, () => rng.next().value);
            expect(actual).toStrictEqual(values.slice(1));
        });
    });
});