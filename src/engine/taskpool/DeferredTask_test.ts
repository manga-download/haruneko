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

        it('Should resolve when action resolves', async () => {
            const testee = new DeferredTask<string>(() => Promise.resolve('✔'), Priority.Normal);
            await testee.Run();
            expect(await testee.Promise).toBe('✔');
        });

        it('Should reject when action rejects', async () => {
            const testee = new DeferredTask<void>(() => Promise.reject(new Error('❌')), Priority.Normal);
            await testee.Run();
            await expect(testee.Promise).rejects.toThrowError('❌');
        });

        it('Should reject when action throws', async () => {
            const testee = new DeferredTask<void>(() => { throw new Error('❌'); }, Priority.Normal);
            await testee.Run();
            await expect(testee.Promise).rejects.toThrowError('❌');
        });
    });
});