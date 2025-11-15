import { describe, it, expect } from 'vitest';
import { RateLimit, Unlimited } from './RateLimit';

describe('RateLimit', () => {

    describe('Throttle', () => {

        it.each([
            [-7, -7, 0],
            [-7, 0, 0],
            [0, -7, 0],
            [0, 0, 0],
            [0, 7, 0],
            [7, 0, 0],
            [1, 7, 7000],
            [7, 7, 1000],
            [10, 7, 700]
        ])('Should calculate expected delay', async (count, span, expected) => {
            const testee = new RateLimit(count, span);
            expect(testee.Throttle).toBe(expected);
        });
    });

    describe('Unlimited', () => {

        it('Should provide expected pre-defined value', async () => {
            const testee = Unlimited;
            expect(testee.Throttle).toBe(0);
        });
    });
});