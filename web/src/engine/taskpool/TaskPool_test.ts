import { inspect } from 'util';
import { vi, describe, it, expect } from 'vitest';
import { TaskPool } from './TaskPool';
import { Priority } from './DeferredTask';
import { RateLimit, Unlimited } from './RateLimit';

class MockJob<T> {
    constructor(public readonly Priority: Priority, public readonly Duration: number, public readonly Result: T, public readonly Signal?: AbortSignal) {
    }
}

class Result<T> {
    constructor(public readonly ResolveTime: number, public Status: string, public readonly Value: T) {
    }
}

async function RunJobs<T>(testee: TaskPool, ... jobs: MockJob<T>[]): Promise<Result<T>[]> {
    const promises: Promise<Result<T>>[] = [];
    for(const job of jobs) {
        const task = testee.Add(() => new Promise<Result<T>>(resolve => {
            setTimeout(() => resolve(new Result(performance.now(), '', job.Result)), job.Duration);
        }), job.Priority, job?.Signal);
        promises.push(task);
    }
    const results = await Promise.allSettled(promises);
    results.filter(p => p['value'] !== undefined).forEach(p => p['value'].Status = p.status);
    return results.map(p => p['value']);
}

describe('TaskPool', () => {

    describe('Constructor', () => {

        it('Should initialize with parameters', async () => {
            const workers = 7;
            const limit = new RateLimit(5, 10);
            const testee = new TaskPool(workers, limit);
            expect(testee.Workers).toBe(workers);
            expect(testee.RateLimit).toBe(limit);
        });
    });

    describe('Workers', () => {

        it('Should correctly set value', async () => {
            const expected = 7;
            const testee = new TaskPool(1, Unlimited);
            testee.Workers = expected;
            expect(testee.Workers).toBe(expected);
        });
    });

    describe('RateLimit', () => {

        it('Should correctly set value', async () => {
            const expected = new RateLimit(5, 10);
            const testee = new TaskPool(1, Unlimited);
            testee.RateLimit = expected;
            expect(testee.RateLimit).toBe(expected);
        });
    });

    describe('Add', () => {

        it('Should automatically process added task', async () => {
            const testee = new TaskPool(1);
            const promise = testee.Add(() => Promise.resolve(7), Priority.Normal);
            expect(inspect(promise)).toContain('<pending>');
            await new Promise(resolve => setTimeout(resolve, 10));
            expect(await promise).toBe(7);
        });

        it('Should resolve queued tasks in order', async () => {
            const testee = new TaskPool(1, Unlimited);
            const results = await RunJobs(testee,
                new MockJob(Priority.Normal, 1, '①'),
                new MockJob(Priority.Normal, 10, '②'),
                new MockJob(Priority.Normal, 1, '③')
            );
            try {
                for(let i = 1; i < results.length; i++) {
                    expect(results[i-1].ResolveTime).toBeLessThan(results[i].ResolveTime);
                }
                expect(results.map(r => r.Value)).toEqual([ '①', '②', '③' ]);
                expect(results.map(r => r.Status)).toEqual(new Array(results.length).fill('fulfilled'));
            } catch(error) {
                console.log(results);
                throw error;
            }
        });

        it('Should correctly prioritize tasks', async () => {
            const testee = new TaskPool(1, Unlimited);
            const results = await RunJobs(testee,
                new MockJob(Priority.Normal, 1, '①'),
                new MockJob(Priority.Low, 1, '②'),
                new MockJob(Priority.Low, 1, '③'),
                new MockJob(Priority.Normal, 1, '④'),
                new MockJob(Priority.Low, 1, '⑤'),
                new MockJob(Priority.High, 1, '⑥'),
                new MockJob(Priority.High, 1, '⑦'),
                new MockJob(Priority.Normal, 1, '⑧'),
                new MockJob(Priority.Low, 1, '⑨')
            );
            try {
                expect(results.map(r => r.Value)).toEqual([ '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨' ]);
                results.sort((a, b) => a.ResolveTime - b.ResolveTime);
                expect(results.map(r => r.Value)).toEqual([ '⑥', '⑦', '①', '④', '⑧', '②', '③', '⑤', '⑨' ]);
            } catch(error) {
                console.log(results);
                throw error;
            }
        });

        it('Should process tasks added after break', async () => {
            const testee = new TaskPool(1, Unlimited);
            let actual = await RunJobs(testee, new MockJob(Priority.Normal, 1, '①'));
            expect(actual.map(r => r.Value)).toEqual([ '①' ]);
            await new Promise(resolve => setTimeout(resolve, 25));
            actual = await RunJobs(testee, new MockJob(Priority.Normal, 1, '②'));
            expect(actual.map(r => r.Value)).toEqual([ '②' ]);
            await new Promise(resolve => setTimeout(resolve, 25));
            actual = await RunJobs(testee, new MockJob(Priority.Normal, 1, '③'));
            expect(actual.map(r => r.Value)).toEqual([ '③' ]);
        });

        (process.platform === 'win32' ? it.skip : it)('Should utilize workers for concurrent processing', {
            retry: process.platform === 'win32' ? 50 : 5
        }, async () => {
            const testee = new TaskPool(3, Unlimited);
            const start = performance.now();
            const results = await RunJobs(testee,
                new MockJob(Priority.Normal, 10, '①'),
                new MockJob(Priority.Normal, 11, '②'),
                new MockJob(Priority.Normal, 12, '③'),
                new MockJob(Priority.Normal, 10, '④'),
                new MockJob(Priority.Normal, 11, '⑤'),
                new MockJob(Priority.Normal, 12, '⑥'),
                new MockJob(Priority.Normal, 10, '⑦'),
                new MockJob(Priority.Normal, 11, '⑧'),
                new MockJob(Priority.Normal, 12, '⑨')
            );
            const elapsed = performance.now() - start;
            try {
                expect(results.map(r => r.Value)).toEqual([ '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨' ]);
            } catch(error) {
                console.log(results);
                throw error;
            }
            const timestamps = results.map(r => r.ResolveTime);
            const batches = [ timestamps.slice(0, 3), timestamps.slice(3, 6), timestamps.slice(6, 9) ];
            const averages = batches.map(batch => batch.reduce((accumulator, timestamp) => accumulator + timestamp, 0) / batch.length);

            for(let i = 0; i < batches.length; i++) {
                for(const timestamp of batches[i]) {
                    const difference = Math.abs(timestamp - averages[i]);
                    expect(difference).toBeLessThan(5);
                }
            }

            // NOTE: Assumption that interval time for checking available workers is ~50 ms
            //       See: TaskPool.ConcurrencySlotAvailable()
            expect(averages[1] - averages[0]).toBeGreaterThan(50);
            expect(averages[1] - averages[0]).toBeLessThan(65);
            expect(averages[2] - averages[1]).toBeGreaterThan(50);
            expect(averages[2] - averages[1]).toBeLessThan(65);

            // NOTE: Assumption that interval time for checking available workers is ~50 ms (3 performed batches)
            //       See: TaskPool.ConcurrencySlotAvailable()
            expect(elapsed).toBeLessThan(3 * 50);
        });

        it('Should reject aborted task', async () => {
            const testee = new TaskPool(1);
            const controller = new AbortController();
            controller.abort();
            const action = vi.fn(() => Promise.resolve());
            const task = testee.Add(action, Priority.Normal, controller.signal);
            try {
                await task;
                throw new Error();
            } catch(error) {
                expect(error).toBeInstanceOf(DOMException);
                expect(error.code).toBe(DOMException.ABORT_ERR);
            }
            expect(action).not.toBeCalled();
        });

        it('Should skip aborted tasks', {
            retry: process.platform === 'win32' ? 50 : 5
        }, async () => {
            const testee = new TaskPool(1);
            const controller = new AbortController();
            const start = performance.now();
            const promise = RunJobs(testee,
                new MockJob(Priority.Normal, 5, '①'),
                new MockJob(Priority.Normal, 1000, '②', controller.signal),
                new MockJob(Priority.Normal, 0, '③'),
                new MockJob(Priority.Normal, 1000, '④', controller.signal),
                new MockJob(Priority.Normal, 0, '⑤'),
                new MockJob(Priority.Normal, 1000, '⑥', controller.signal),
                new MockJob(Priority.Normal, 0, '⑦'),
                new MockJob(Priority.Normal, 1000, '⑧', controller.signal),
                new MockJob(Priority.Normal, 0, '⑨')
            );
            controller.abort();
            const results = await promise;
            const elapsed = performance.now() - start;
            try {
                expect(results.map(r => r?.Value)).toEqual([ '①', undefined, '③', undefined, '⑤', undefined, '⑦', undefined, '⑨' ]);
            } catch(error) {
                console.log(results);
                throw error;
            }
            // NOTE: Assumption that interval time for checking available workers is ~50 ms (5 performed tasks)
            //       See: TaskPool.ConcurrencySlotAvailable()
            const epsilon = process.platform === 'win32' ? 15 : 0;
            expect(elapsed).toBeLessThan(5 * 50 + epsilon);
        });
    });
});