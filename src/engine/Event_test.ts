import { mock } from 'vitest-mock-extended';
import { vi, describe, it, expect } from 'vitest';
import { Event } from './Event';

function AssertSubscribeOnce<TSender, TArgs>(testee: Event<TSender, TArgs>): void {
    it('Should only subscribe once', async () => {
        const sender = mock<TSender>();
        const args = mock<TArgs>();
        const callback = vi.fn();

        testee.Subscribe(callback);
        testee.Subscribe(callback);
        testee.Dispatch(sender, args);

        expect(callback).toBeCalledTimes(1);
        expect(callback).toBeCalledWith(sender, args);
    });
}

function AssertInvokeAllSubscriptions<TSender, TArgs>(testee: Event<TSender, TArgs>): void {
    it('Should invoke all subscribed callbacks', async () => {
        const sender = mock<TSender>();
        const args = mock<TArgs>();
        const mockError = vi.fn();
        mockError.mockImplementation(() => { throw new Error(); });
        const callbacks = [
            mockError,
            vi.fn(),
            vi.fn(),
            vi.fn(),
        ];

        callbacks.forEach(callback => testee.Subscribe(callback));
        testee.Dispatch(sender, args);

        for(const callback of callbacks) {
            expect(callback).toBeCalledTimes(1);
            expect(callback).toBeCalledWith(sender, args);
        }
    });
}

function AssertUnsubscribe<TSender, TArgs>(testee: Event<TSender, TArgs>): void {
    it('Should no longer invoke unsubscribed callbacks', async () => {
        const sender = mock<TSender>();
        const args = mock<TArgs>();
        const callbacks = [
            vi.fn(),
            vi.fn(),
        ];

        testee.Subscribe(callbacks[0]);
        testee.Subscribe(callbacks[1]);
        testee.Unsubscribe(callbacks[0]);
        testee.Unsubscribe(callbacks[0]);
        testee.Dispatch(sender, args);

        expect(callbacks[0]).toBeCalledTimes(0);
        expect(callbacks[1]).toBeCalledTimes(1);
    });
}

describe('Event', () => {

    describe('Subsribe', () => {
        AssertSubscribeOnce(new Event<string, number>());
    });

    describe('Dispatch', () => {
        AssertInvokeAllSubscriptions(new Event<string, number>());
    });

    describe('Unsubsribe', () => {
        AssertUnsubscribe(new Event<string, number>());
    });
});