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

    describe('Mulberry32', () => {
        it.each([
            [0, [1144304738, 1416247, 958946056, 627933444, 2007157716]],
            [3, [3093350482, 166052715, 1959330548, 321813351, 3277083196]],
            [-1, [3850105811, 813802916, 3073704848, 4054706436, 3630262831]],
        ])('Should generate expected numbers for seed %i', (seed, expected) => {
            const prng = testee.Mulberry32(seed);
            expect(expected.map(() => prng.next().value)).toStrictEqual(expected);
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
        it.each([
            [testee.XorShift32, 0, ['B', 'C', 'D', 'E', 'F', 'A']],
            [testee.XorShift32, 3, ['C', 'E', 'A', 'F', 'B', 'D']],
            [testee.XorShift32, 7, ['C', 'B', 'E', 'F', 'A', 'D']],
        ])('Should create expected sequence', (prng, seed, expected) => {
            const actual = new FisherYates(prng(seed)).Shuffle('A', 'B', 'C', 'D', 'E', 'F');
            expect(actual).toStrictEqual(expected);
        });

        it('preserves the fractional shuffle and subsequent flips used by NexusScans', () => {
            const rng = testee.ToUnitInterval(testee.Mulberry32(123456789));
            const actual = new FisherYates(rng, 'fraction').Shuffle(...new Array(12).keys());
            const flips = Array.from({ length: 12 }, () => Math.floor(rng.next().value * 4));
            expect(actual).toStrictEqual([6, 9, 11, 0, 8, 4, 5, 2, 1, 7, 10, 3]);
            expect(flips).toStrictEqual([1, 2, 0, 1, 3, 2, 1, 3, 3, 0, 1, 2]);
        });

        it('does not consume random values for empty or singleton shuffles', () => {
            const rng = testee.Mulberry32(0);
            const shuffle = new FisherYates(rng);
            expect(shuffle.Shuffle()).toStrictEqual([]);
            expect(shuffle.Shuffle('A')).toStrictEqual(['A']);
            expect(rng.next().value).toBe(1144304738);
        });

        it('consumes exactly one value per swap across successive shuffles', () => {
            const rng = testee.ToUnitInterval(testee.Mulberry32(0));
            const shuffle = new FisherYates(rng, 'fraction');
            shuffle.Shuffle(0, 1, 2);
            shuffle.Shuffle(0, 1);
            expect(rng.next().value).toBe(627933444 / 2**32);
        });
    });
});