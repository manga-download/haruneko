import { RequestRateLimit } from './RequestRateLimit';

describe('RequestRateLimit', () => {

    describe('Constructor', () => {

        it('Should assign parameters', async () => {
            const testee = new RequestRateLimit(7, 19);
            expect(testee.RequestCount).toBe(7);
            expect(testee.TimeSpan).toBe(19);
        });
    });

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
            const testee = new RequestRateLimit(count, span);
            expect(testee.Throttle).toBe(expected);
        });

        it('Should update when change properties', async () => {
            const testee = new RequestRateLimit(0, 0);
            expect(testee.Throttle).toBe(0);
            testee.RequestCount = 10;
            testee.TimeSpan = 7;
            expect(testee.Throttle).toBe(700);
        });
    });

    describe('Unlimited', () => {

        it('Should provide pre-defined static value', async () => {
            const testee = RequestRateLimit.Unlimited;
            expect(testee.RequestCount).toBe(0);
            expect(testee.TimeSpan).toBe(0);
            expect(testee.Throttle).toBe(0);
        });
    });
});