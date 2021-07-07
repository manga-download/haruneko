import { mock, mockFn } from 'jest-mock-extended';
import { IEvent, EventManager } from './EventManager';

function AssertSubscribeOnce<TSender, TArgs>(testee: IEvent<TSender, TArgs>): void {
    it('Should only subscribe once', async () => {
        const sender = mock<TSender>();
        const args = mock<TArgs>();
        const callback = mockFn<(sender: TSender, args: TArgs) => void>();

        testee.Subscribe(callback);
        testee.Subscribe(callback);
        testee.Dispatch(sender, args);

        expect(callback).toBeCalledTimes(1);
        expect(callback).toBeCalledWith(sender, args);
        //callback.calledWith(sender, args);
    });
}

function AssertInvokeAllSubscriptions<TSender, TArgs>(testee: IEvent<TSender, TArgs>): void {
    it('Should invoke all subscribed callbacks', async () => {
        const sender = mock<TSender>();
        const args = mock<TArgs>();
        const callbacks = [
            mockFn<(sender: TSender, args: TArgs) => void>(),
            mockFn<(sender: TSender, args: TArgs) => void>(),
            mockFn<(sender: TSender, args: TArgs) => void>()
        ];

        callbacks.forEach(callback => testee.Subscribe(callback));
        testee.Dispatch(sender, args);

        for(const callback of callbacks) {
            expect(callback).toBeCalledTimes(1);
            expect(callback).toBeCalledWith(sender, args);
            //callback.calledWith(sender, args);
        }
    });
}

function AssertUnsubscribe<TSender, TArgs>(testee: IEvent<TSender, TArgs>): void {
    it('Should no longer invoke unsubscribed callbacks', async () => {
        const sender = mock<TSender>();
        const args = mock<TArgs>();
        const callbacks = [
            mockFn<(sender: TSender, args: TArgs) => void>(),
            mockFn<(sender: TSender, args: TArgs) => void>()
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

describe('EventManager', () => {

    describe('FrontendLoaded', () => {

        AssertSubscribeOnce(new EventManager().FrontendLoaded);
        AssertInvokeAllSubscriptions(new EventManager().FrontendLoaded);
        AssertUnsubscribe(new EventManager().FrontendLoaded);
    });
});