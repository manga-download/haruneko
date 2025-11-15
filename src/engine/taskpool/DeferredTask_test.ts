import { vi, describe, it, expect } from 'vitest';
import { inspect } from 'util';
import { DeferredTask, Priority } from './DeferredTask';

describe('DeferredTask', () => {

    describe('Constructor', () => {

        it('Should assign parameters', async () => {
            const testee = new DeferredTask<void>(() => Promise.resolve(), Priority.Normal);
            expect(inspect(testee.Promise)).toContain('<pending>');
            expect(testee.Priority).toBe(Priority.Normal);
        });
    });

    describe('Promise', () => {

        it('Should be pending when action not ran', async () => {
            const testee = new DeferredTask<string>(() => Promise.resolve('✓'), Priority.Normal);
            await new Promise(resolve => setTimeout(resolve, 25));
            expect(inspect(testee.Promise)).toContain('<pending>');
        });
    });

    describe('Run', () => {

        it('Should resolve promise when action resolves', async () => {
            const testee = new DeferredTask<string>(() => Promise.resolve('✔'), Priority.Normal);
            await testee.Run();
            expect(await testee.Promise).toBe('✔');
        });

        it('Should reject promise when action rejects', async () => {
            const testee = new DeferredTask<void>(() => Promise.reject(new Error('❌')), Priority.Normal);
            await testee.Run();
            await expect(testee.Promise).rejects.toThrowError('❌');
        });

        it('Should reject promise when action throws', async () => {
            const testee = new DeferredTask<void>(() => { throw new Error('❌'); }, Priority.Normal);
            await testee.Run();
            await expect(testee.Promise).rejects.toThrowError('❌');
        });

        it('Should not reject promise when abort signal was not received', async () => {
            const testee = new DeferredTask<string>(() => Promise.resolve('✔'), Priority.Normal, new AbortController().signal);
            await testee.Run();
            expect(testee.Signal.aborted).toBe(false);
            expect(await testee.Promise).toBe('✔');
        });

        it('Should reject promise when abort signal was received', async () => {
            const cancellator = new AbortController();
            const action = vi.fn(() => Promise.resolve());
            const testee = new DeferredTask<void>(action, Priority.Normal, cancellator.signal);
            cancellator.abort();
            await testee.Run();
            expect(action).not.toBeCalled();
            expect(testee.Signal.aborted).toBe(true);
            try {
                await testee.Promise;
                throw new Error();
            } catch(error) {
                expect(error).toBeInstanceOf(DOMException);
                expect(error.code).toBe(DOMException.ABORT_ERR);
            }
        });
    });

    describe('RejectWhenAborted', () => {

        it('Should not reject promise when abort signal is not present', async () => {
            const action = vi.fn(() => Promise.resolve());
            const testee = new DeferredTask<void>(action, Priority.Normal);
            expect(testee.RejectWhenAborted()).toBe(false);
            expect(action).not.toBeCalled();
            expect(inspect(testee.Promise)).toContain('<pending>');
        });

        it('Should not reject promise when abort signal was not received', async () => {
            const action = vi.fn(() => Promise.resolve());
            const testee = new DeferredTask<void>(action, Priority.Normal, new AbortController().signal);
            expect(testee.RejectWhenAborted()).toBe(false);
            expect(action).not.toBeCalled();
            expect(testee.Signal.aborted).toBe(false);
            expect(inspect(testee.Promise)).toContain('<pending>');
        });

        it('Should reject promise when abort signal was received', async () => {
            const cancellator = new AbortController();
            const action = vi.fn(() => Promise.resolve());
            const testee = new DeferredTask<void>(action, Priority.Normal, cancellator.signal);
            cancellator.abort();
            expect(testee.RejectWhenAborted()).toBe(true);
            expect(action).not.toBeCalled();
            expect(testee.Signal.aborted).toBe(true);
            try {
                await testee.Promise;
                throw new Error();
            } catch(error) {
                expect(error).toBeInstanceOf(DOMException);
                expect(error.code).toBe(DOMException.ABORT_ERR);
            }
        });
    });
});