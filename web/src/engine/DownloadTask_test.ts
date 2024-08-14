import { mock } from 'vitest-mock-extended';
import { vi, describe, it, expect } from 'vitest';
import { DownloadTask, Status } from './DownloadTask';
import type { StoreableMediaContainer, MediaItem } from './providers/MediaPlugin';
import type { StorageController } from './StorageController';
import { DeferredTask } from './taskpool/DeferredTask';

function MockItem(resolve: boolean, delay: number = undefined) {
    const item = mock<MediaItem>();
    if(resolve) {
        if(delay) {
            item.Fetch.mockReturnValue(new Promise(resolve => setTimeout(resolve, 5)));
        } else {
            item.Fetch.mockResolvedValue(null);
        }
    } else {
        if(delay) {
            item.Fetch.mockReturnValue(new Promise((_, reject) => setTimeout(reject, 5)));
        } else {
            item.Fetch.mockRejectedValue('x');
        }
    }
    return item;
}

class TestFixture {

    public readonly StorageControllerMock = mock<StorageController>();
    private readonly MediaContainerEntriesMock = vi.fn();
    public readonly MediaContainerMock = mock<StoreableMediaContainer<MediaItem>>();
    public readonly StatusChangedCallbackMock = vi.fn();
    public readonly ProgressChangedCallbackMock = vi.fn();

    constructor() {
        const base = {};
        Object.defineProperty(base, 'Entries', { get: this.MediaContainerEntriesMock });
        this.MediaContainerMock = mock<StoreableMediaContainer<MediaItem>>(base);
    }

    public CreateTestee() {
        const testee = new DownloadTask(this.MediaContainerMock, this.StorageControllerMock);
        testee.Status.Subscribe(this.StatusChangedCallbackMock);
        testee.Progress.Subscribe(this.ProgressChangedCallbackMock);
        return testee;
    }

    public SetupMediaContainer(items: MediaItem[]): TestFixture {
        this.MediaContainerEntriesMock.mockReset();
        this.MediaContainerEntriesMock.mockReturnValue({ Value: items });
        return this;
    }
}

describe('DownloadTask', () => {

    describe('Constructor', () => {

        it('Should correctly initialize', async () => {
            const fixture = new TestFixture().SetupMediaContainer([]);
            const testee = fixture.CreateTestee();

            expect(typeof testee.ID).toBe('symbol');
            expect(Date.now() - testee.Created.getTime()).toBeLessThan(7.5);
            await new Promise(resolve => setTimeout(resolve, 5));
            expect(testee.Media).toBe(fixture.MediaContainerMock);
            expect(testee.Errors).toEqual([]);
            expect(testee.Status.Value).toBe(Status.Queued);
            expect(fixture.StatusChangedCallbackMock).not.toBeCalled();
            expect(testee.Progress.Value).toBe(0);
            expect(fixture.ProgressChangedCallbackMock).not.toBeCalled();
        });
    });

    describe('Run', () => {

        it('Should process all entries in container on success', async () => {
            const items = [ MockItem(true), MockItem(true), MockItem(true), MockItem(true) ];
            const fixture = new TestFixture().SetupMediaContainer(items);
            fixture.MediaContainerMock.Store.mockResolvedValue();
            const testee = fixture.CreateTestee();

            await testee.Run();

            for(const item of items) {
                expect(item.Fetch).toBeCalledTimes(1);
            }
            expect(fixture.MediaContainerMock.Update).toBeCalledTimes(1);
            expect(fixture.MediaContainerMock.Store).toBeCalledTimes(1);
            expect(fixture.StorageControllerMock.SaveTemporary).toBeCalledTimes(4);
            expect(fixture.StorageControllerMock.RemoveTemporary).toBeCalledTimes(1);
        });

        it('Should gracefully succeed on downloading errors', async () => {
            const items = [ MockItem(true), MockItem(false), MockItem(true), MockItem(false) ];
            const fixture = new TestFixture().SetupMediaContainer(items);
            const testee = fixture.CreateTestee();

            await testee.Run();

            for(const item of items) {
                expect(item.Fetch).toBeCalledTimes(1);
            }
            expect(fixture.MediaContainerMock.Update).toBeCalledTimes(1);
            expect(fixture.MediaContainerMock.Store).toBeCalledTimes(0);
            expect(fixture.StorageControllerMock.SaveTemporary).toBeCalledTimes(2);
            expect(fixture.StorageControllerMock.RemoveTemporary).toBeCalledTimes(1);
        });

        it('Should gracefully succeed on processing error', async () => {
            const items = [ MockItem(true), MockItem(true), MockItem(true), MockItem(true) ];
            const fixture = new TestFixture().SetupMediaContainer(items);
            fixture.MediaContainerMock.Store.mockRejectedValue('o');
            const testee = fixture.CreateTestee();

            await testee.Run();

            for(const item of items) {
                expect(item.Fetch).toBeCalledTimes(1);
            }
            expect(fixture.MediaContainerMock.Update).toBeCalledTimes(1);
            expect(fixture.MediaContainerMock.Store).toBeCalledTimes(1);
            expect(fixture.StorageControllerMock.SaveTemporary).toBeCalledTimes(4);
            expect(fixture.StorageControllerMock.RemoveTemporary).toBeCalledTimes(1);
        });

        it('Should prevent multiple calls', async () => {
            const item = MockItem(true, 5);
            const fixture = new TestFixture().SetupMediaContainer([ item ]);
            fixture.MediaContainerMock.Store.mockResolvedValue();
            const testee = fixture.CreateTestee();

            const promise = testee.Run();
            testee.Run();
            await promise;

            expect(item.Fetch).toBeCalledTimes(1);
            expect(fixture.MediaContainerMock.Update).toBeCalledTimes(1);
            expect(fixture.MediaContainerMock.Store).toBeCalledTimes(1);
            expect(fixture.StorageControllerMock.SaveTemporary).toBeCalledTimes(1);
            expect(fixture.StorageControllerMock.RemoveTemporary).toBeCalledTimes(1);
        });
    });

    describe('Abort', () => {

        it('Should signal abort for active downloads', async () => {
            const signals: AbortSignal[] = [];
            const item = mock<MediaItem>();
            item.Fetch.mockImplementation((_, signal) => {
                signals.push(signal);
                return Promise.resolve(null);
            });
            const fixture = new TestFixture().SetupMediaContainer([ item, item, item, item ]);
            fixture.MediaContainerMock.Store.mockResolvedValue();
            const testee = fixture.CreateTestee();

            const promise = testee.Run();
            testee.Abort();
            await promise;

            expect(signals.length).toBe(4);
            for(const signal of signals) {
                expect(signal.aborted).toBeTruthy();
            }
        });

        it('Should reset abort after success', async () => {
            const fixture = new TestFixture().SetupMediaContainer([ MockItem(true) ]);
            fixture.MediaContainerMock.Store.mockResolvedValue();
            const testee = fixture.CreateTestee();

            const promise = testee.Run();
            const abort = testee.Abort;
            await promise;

            expect(abort).not.toBe(testee.Abort);
        });

        it('Should reset abort after downloading error', async () => {
            const fixture = new TestFixture().SetupMediaContainer([ MockItem(false) ]);
            const testee = fixture.CreateTestee();

            const promise = testee.Run();
            const abort = testee.Abort;
            await promise;

            expect(abort).not.toBe(testee.Abort);
        });

        it('Should reset abort after processing error', async () => {
            const fixture = new TestFixture().SetupMediaContainer([ MockItem(false) ]);
            fixture.MediaContainerMock.Store.mockRejectedValue('o');
            const testee = fixture.CreateTestee();

            const promise = testee.Run();
            const abort = testee.Abort;
            await promise;

            expect(abort).not.toBe(testee.Abort);
        });
    });

    describe('Errors', () => {

        it('Should be empty on success', async () => {
            const items = [ MockItem(true), MockItem(true), MockItem(true), MockItem(true) ];
            const fixture = new TestFixture().SetupMediaContainer(items);
            fixture.MediaContainerMock.Store.mockResolvedValue();
            const testee = fixture.CreateTestee();

            await testee.Run();

            expect(testee.Errors.length).toBe(0);
        });

        it('Should catch and keep all downloading errors', async () => {
            const items = [ MockItem(true), MockItem(false), MockItem(true), MockItem(false) ];
            const fixture = new TestFixture().SetupMediaContainer(items);
            const testee = fixture.CreateTestee();

            await testee.Run();

            expect(testee.Errors.length).toBe(2);
            expect(testee.Errors[0].message).toBe('x');
            expect(testee.Errors[1].message).toBe('x');
        });

        it('Should catch and keep any processing error', async () => {
            const items = [ MockItem(true), MockItem(true), MockItem(true), MockItem(true) ];
            const fixture = new TestFixture().SetupMediaContainer(items);
            fixture.MediaContainerMock.Store.mockRejectedValue('o');
            const testee = fixture.CreateTestee();

            await testee.Run();

            expect(testee.Errors.length).toBe(1);
            expect(testee.Errors[0].message).toBe('o');
        });
    });

    describe('Status', () => {

        it('Should set expected values on success', async () => {
            const item = MockItem(true, 5);
            const fixture = new TestFixture().SetupMediaContainer([ item ]);
            const cleaned = new DeferredTask(() => Promise.resolve(), undefined);
            fixture.StorageControllerMock.RemoveTemporary.mockImplementationOnce(() => cleaned.Run());
            fixture.MediaContainerMock.Store.mockResolvedValue();
            const testee = fixture.CreateTestee();

            expect(testee.Status.Value).toBe(Status.Queued);
            const promise = testee.Run();
            expect(testee.Status.Value).toBe(Status.Downloading);
            await cleaned.Promise;
            expect(testee.Status.Value).toBe(Status.Processing);
            await promise;
            expect(testee.Status.Value).toBe(Status.Completed);
        });

        it('Should set expected values on downloading error', async () => {
            const item = MockItem(false, 5);
            const fixture = new TestFixture().SetupMediaContainer([ item ]);
            const cleaned = new DeferredTask(() => Promise.resolve(), undefined);
            fixture.StorageControllerMock.RemoveTemporary.mockImplementationOnce(() => cleaned.Run());
            const testee = fixture.CreateTestee();

            expect(testee.Status.Value).toBe(Status.Queued);
            const promise = testee.Run();
            expect(testee.Status.Value).toBe(Status.Downloading);
            await cleaned.Promise;
            expect(testee.Status.Value).toBe(Status.Downloading);
            await promise;
            expect(testee.Status.Value).toBe(Status.Failed);
        });

        it('Should set expected values on processing error', async () => {
            const item = MockItem(true, 5);
            const fixture = new TestFixture().SetupMediaContainer([ item ]);
            const cleaned = new DeferredTask(() => Promise.resolve(), undefined);
            fixture.StorageControllerMock.RemoveTemporary.mockImplementationOnce(() => cleaned.Run());
            fixture.MediaContainerMock.Store.mockRejectedValue('o');
            const testee = fixture.CreateTestee();

            expect(testee.Status.Value).toBe(Status.Queued);
            const promise = testee.Run();
            expect(testee.Status.Value).toBe(Status.Downloading);
            await cleaned.Promise;
            expect(testee.Status.Value).toBe(Status.Processing);
            await promise;
            expect(testee.Status.Value).toBe(Status.Failed);
        });
    });

    describe('StatusChanged', () => {

        it('Should invoke expected events on success', async () => {
            const item = MockItem(true);
            const fixture = new TestFixture().SetupMediaContainer([ item ]);
            fixture.MediaContainerMock.Store.mockResolvedValue();
            const testee = fixture.CreateTestee();

            await testee.Run();

            expect(fixture.StatusChangedCallbackMock).toBeCalledTimes(3);
            expect(fixture.StatusChangedCallbackMock).toHaveBeenNthCalledWith(1, Status.Downloading, testee);
            expect(fixture.StatusChangedCallbackMock).toHaveBeenNthCalledWith(2, Status.Processing, testee);
            expect(fixture.StatusChangedCallbackMock).toHaveBeenNthCalledWith(3, Status.Completed, testee);
        });

        it('Should invoke expected events on downloading error', async () => {
            const item = MockItem(false);
            const fixture = new TestFixture().SetupMediaContainer([ item ]);
            const testee = fixture.CreateTestee();

            await testee.Run();

            expect(fixture.StatusChangedCallbackMock).toBeCalledTimes(2);
            expect(fixture.StatusChangedCallbackMock).toHaveBeenNthCalledWith(1, Status.Downloading, testee);
            expect(fixture.StatusChangedCallbackMock).toHaveBeenNthCalledWith(2, Status.Failed, testee,);
        });

        it('Should invoke expected events on processing error', async () => {
            const item = MockItem(true);
            const fixture = new TestFixture().SetupMediaContainer([ item ]);
            fixture.MediaContainerMock.Store.mockRejectedValue('o');
            const testee = fixture.CreateTestee();

            await testee.Run();

            expect(fixture.StatusChangedCallbackMock).toBeCalledTimes(3);
            expect(fixture.StatusChangedCallbackMock).toHaveBeenNthCalledWith(1, Status.Downloading, testee,);
            expect(fixture.StatusChangedCallbackMock).toHaveBeenNthCalledWith(2, Status.Processing, testee,);
            expect(fixture.StatusChangedCallbackMock).toHaveBeenNthCalledWith(3, Status.Failed, testee,);
        });
    });

    describe('Progress', () => {

        it('Should set expected values on success', async () => {
            const item = MockItem(true, 5);
            const fixture = new TestFixture().SetupMediaContainer([ item ]);
            const testee = fixture.CreateTestee();

            expect(testee.Progress.Value).toBe(0);
            const promise = testee.Run();
            expect(testee.Progress.Value).toBe(0);
            await promise;
            expect(testee.Progress.Value).toBe(1);
        });

        it('Should set expected values on downloading errors', async () => {
            const items = [ MockItem(true, 5), MockItem(false, 5), MockItem(true, 5), MockItem(false, 5) ];
            const fixture = new TestFixture().SetupMediaContainer(items);
            const testee = fixture.CreateTestee();

            expect(testee.Progress.Value).toBe(0);
            const promise = testee.Run();
            expect(testee.Progress.Value).toBe(0);
            await promise;
            expect(testee.Progress.Value).toBe(2/4);
        });

        it('Should set expected values on processing error', async () => {
            const items = [ MockItem(true, 5), MockItem(true, 5), MockItem(true, 5), MockItem(true, 5) ];
            const fixture = new TestFixture().SetupMediaContainer(items);
            fixture.MediaContainerMock.Store.mockRejectedValue('o');
            const testee = fixture.CreateTestee();

            expect(testee.Progress.Value).toBe(0);
            const promise = testee.Run();
            expect(testee.Progress.Value).toBe(0);
            await promise;
            expect(testee.Progress.Value).toBe(1.0);
        });
    });

    describe('ProgressChanged', () => {

        it('Should invoke expected events on success', async () => {
            const items = [ MockItem(true), MockItem(true), MockItem(true), MockItem(true) ];
            const fixture = new TestFixture().SetupMediaContainer(items);
            fixture.MediaContainerMock.Store.mockResolvedValue();
            const testee = fixture.CreateTestee();

            await testee.Run();

            expect(fixture.ProgressChangedCallbackMock).toBeCalledTimes(items.length + 2);
            for(let page = 1; page <= items.length; page++) {
                expect(fixture.ProgressChangedCallbackMock).toHaveBeenNthCalledWith(page, page/items.length, testee);
            }
            expect(fixture.ProgressChangedCallbackMock).toHaveBeenNthCalledWith(items.length + 1, -1.0, testee);
            expect(fixture.ProgressChangedCallbackMock).toHaveBeenNthCalledWith(items.length + 2, 1.0, testee);
        });

        it('Should invoke expected events on downloading errors', async () => {
            const items = [ MockItem(true), MockItem(false), MockItem(true), MockItem(false) ];
            const fixture = new TestFixture().SetupMediaContainer(items);
            const testee = fixture.CreateTestee();

            await testee.Run();

            expect(fixture.ProgressChangedCallbackMock).toBeCalledTimes(2);
            expect(fixture.ProgressChangedCallbackMock).toHaveBeenNthCalledWith(1, 1/items.length, testee);
            expect(fixture.ProgressChangedCallbackMock).toHaveBeenNthCalledWith(2, 2/items.length, testee);
        });

        it('Should invoke expected events on processing error', async () => {
            const items = [ MockItem(true), MockItem(true), MockItem(true), MockItem(true) ];
            const fixture = new TestFixture().SetupMediaContainer(items);
            fixture.MediaContainerMock.Store.mockRejectedValue('o');
            const testee = fixture.CreateTestee();

            await testee.Run();

            expect(fixture.ProgressChangedCallbackMock).toBeCalledTimes(items.length + 2);
            for(let page = 1; page <= items.length; page++) {
                expect(fixture.ProgressChangedCallbackMock).toHaveBeenNthCalledWith(page, page/items.length, testee);
            }
            expect(fixture.ProgressChangedCallbackMock).toHaveBeenNthCalledWith(items.length + 1, -1.0, testee);
            expect(fixture.ProgressChangedCallbackMock).toHaveBeenNthCalledWith(items.length + 2, 1.0, testee);
        });
    });
});