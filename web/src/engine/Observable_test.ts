import { mockFn } from 'jest-mock-extended';
import { Observable } from './Observable';

describe('Observable', () => {

    it('Should notify each subscriber once via dispatch', () => {
        const owner = new Date();
        const value = { id: 3, label: '✔︎' };
        const callbackAlpha = mockFn<(v, o) => void>();
        const callbackBeta = mockFn<(v, o) => void>();
        const testee = new Observable(value, owner);

        testee.Subscribe(callbackAlpha);
        testee.Subscribe(callbackAlpha);
        testee.Subscribe(callbackBeta);
        testee.Dispatch();

        expect(callbackAlpha).toHaveBeenCalledTimes(1);
        expect(callbackAlpha).toHaveBeenCalledWith(value, owner);
        expect(callbackBeta).toHaveBeenCalledTimes(1);
        expect(callbackBeta).toHaveBeenCalledWith(value, owner);
    });

    it('Should notify each subscriber when value is changed', () => {
        const owner = new Date();
        const value = 7;
        const callbackAlpha = mockFn<(v, o) => void>();
        const callbackBeta = mockFn<(v, o) => void>();
        const testee = new Observable(value, owner);

        testee.Subscribe(callbackAlpha);
        testee.Subscribe(callbackBeta);
        testee.Value += 2;

        expect(callbackAlpha).toHaveBeenCalledTimes(1);
        expect(callbackAlpha).toHaveBeenCalledWith(9, owner);
        expect(callbackBeta).toHaveBeenCalledTimes(1);
        expect(callbackBeta).toHaveBeenCalledWith(9, owner);
    });

    it('Should not notify subscribers when value is unchanged', () => {
        const value = 7;
        const callbackAlpha = mockFn<(v, o) => void>();
        const callbackBeta = mockFn<(v, o) => void>();
        const testee = new Observable(value);

        testee.Subscribe(callbackAlpha);
        testee.Subscribe(callbackBeta);
        testee.Value = value;

        expect(callbackAlpha).toHaveBeenCalledTimes(0);
        expect(callbackBeta).toHaveBeenCalledTimes(0);
    });

    it('Should no longer receive notifications when unsubscribed', () => {
        const callback = mockFn<(v, o) => void>();
        const testee = new Observable(7);

        testee.Subscribe(callback);
        testee.Unsubscribe(callback);
        testee.Dispatch();
        testee.Value++;

        expect(callback).toHaveBeenCalledTimes(0);
    });
});