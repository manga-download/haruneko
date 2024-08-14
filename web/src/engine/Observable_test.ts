import { vi, describe, it, expect } from 'vitest';
import { Observable, ObservableArray, ObservableMap } from './Observable';

describe('Observable', () => {

    it('Should notify each subscriber once via dispatch', () => {
        const owner = new Date();
        const value = { id: 3, label: '✔︎' };
        const callbackAlpha = vi.fn();
        const callbackBeta = vi.fn();
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
        const callbackAlpha = vi.fn();
        const callbackBeta = vi.fn();
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
        const callbackAlpha = vi.fn();
        const callbackBeta = vi.fn();
        const testee = new Observable(value);

        testee.Subscribe(callbackAlpha);
        testee.Subscribe(callbackBeta);
        testee.Value = value;

        expect(callbackAlpha).toHaveBeenCalledTimes(0);
        expect(callbackBeta).toHaveBeenCalledTimes(0);
    });

    it('Should no longer receive notifications when unsubscribed', () => {
        const callback = vi.fn();
        const testee = new Observable(7);

        testee.Subscribe(callback);
        testee.Unsubscribe(callback);
        testee.Dispatch();
        testee.Value++;

        expect(callback).toHaveBeenCalledTimes(0);
    });
});

describe('ObservableArray', () => {

    it('Should extend Observable', () => {
        const testee = new ObservableArray([]);
        expect(testee).toBeInstanceOf(Observable);
    });

    it('Should notify each subscriber when pop is invoked', () => {
        const callback = vi.fn();
        const testee = new ObservableArray([ 1, 2, 3, 4, 5 ]);

        testee.Subscribe(callback);
        const actual = testee.Pop();

        expect(actual).toBe(5);
        expect(testee.Value).toStrictEqual([ 1, 2, 3, 4 ]);
        expect(callback).toHaveBeenCalledWith(testee.Value, undefined);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('Should notify each subscriber when push is invoked ', () => {
        const callback = vi.fn();
        const testee = new ObservableArray([ 1, 2, 3 ]);

        testee.Subscribe(callback);
        const actual = testee.Push(4, 5);

        expect(actual).toBe(5);
        expect(testee.Value).toStrictEqual([ 1, 2, 3, 4, 5 ]);
        expect(callback).toHaveBeenCalledWith(testee.Value, undefined);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('Should notify each subscriber when shift is invoked ', () => {
        const callback = vi.fn();
        const testee = new ObservableArray([ 1, 2, 3, 4, 5 ]);

        testee.Subscribe(callback);
        const actual = testee.Shift();

        expect(actual).toBe(1);
        expect(testee.Value).toStrictEqual([ 2, 3, 4, 5 ]);
        expect(callback).toHaveBeenCalledWith(testee.Value, undefined);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('Should notify each subscriber when unshift is invoked ', () => {
        const callback = vi.fn();
        const testee = new ObservableArray([ 3, 4, 5 ]);

        testee.Subscribe(callback);
        const actual = testee.Unshift(1, 2);

        expect(actual).toBe(5);
        expect(testee.Value).toStrictEqual([ 1, 2, 3, 4, 5 ]);
        expect(callback).toHaveBeenCalledWith(testee.Value, undefined);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('Should notify each subscriber when splice is invoked ', () => {
        const callback = vi.fn();
        const testee = new ObservableArray([ 1, 2, 3, 4, 5 ]);

        testee.Subscribe(callback);
        const actual = testee.Splice(1, 3, 999, 777);

        expect(actual).toStrictEqual([ 2, 3, 4 ]);
        expect(testee.Value).toStrictEqual([ 1, 999, 777, 5 ]);
        expect(callback).toHaveBeenCalledWith(testee.Value, undefined);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('Should notify each subscriber when sort is invoked ', () => {
        const callback = vi.fn();
        const testee = new ObservableArray([ 1, 3, 5, 2, 4 ]);

        testee.Subscribe(callback);
        const actual = testee.Sort((a, b) => a - b);

        expect(actual).toBe(testee.Value);
        expect(testee.Value).toStrictEqual([ 1, 2, 3, 4, 5 ]);
        expect(callback).toHaveBeenCalledWith(testee.Value, undefined);
        expect(callback).toHaveBeenCalledTimes(1);
    });
});

describe('ObservableMap', () => {

    it('Should extend Observable', () => {
        const testee = new ObservableMap<string, number>(new Map());
        expect(testee).toBeInstanceOf(Observable);
    });

    it('Should determine the size of map', () => {
        const testee = new ObservableMap<string, number>(new Map([
            [ 'x', 7 ],
            [ 'y', 11 ],
            [ 'z', 13 ],
        ]));
        expect(testee.Size).toBe(3);
    });

    it('Should determine the existance of an element in the map', () => {
        const testee = new ObservableMap<string, number>(new Map([ [ 'x', 7 ] ]));
        expect(testee.Has('x')).toBe(true);
    });

    it('Should get an element in the map', () => {
        const testee = new ObservableMap<string, number>(new Map([ [ 'x', 7 ] ]));
        expect(testee.Get('x')).toBe(7);
    });

    it('Should notify each subscriber when an element is inserted', () => {
        const callback = vi.fn();
        const testee = new ObservableMap<string, number>(new Map());

        testee.Subscribe(callback);
        testee.Set('x', 13);

        expect(testee.Value.get('x')).toBe(13);
        expect(callback).toHaveBeenCalledWith(testee.Value, undefined);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('Should notify each subscriber when an element is updated', () => {
        const callback = vi.fn();
        const testee = new ObservableMap<string, number>(new Map([ [ 'x', 7 ] ]));

        testee.Subscribe(callback);
        testee.Set('x', 13);

        expect(testee.Value.get('x')).toBe(13);
        expect(callback).toHaveBeenCalledWith(testee.Value, undefined);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('Should notify each subscriber when an element is removed', () => {
        const callback = vi.fn();
        const testee = new ObservableMap<string, number>(new Map([ [ 'x', 7 ] ]));

        testee.Subscribe(callback);
        testee.Delete('x');

        expect(testee.Size).toBe(0);
        expect(callback).toHaveBeenCalledWith(testee.Value, undefined);
        expect(callback).toHaveBeenCalledTimes(1);
    });
});