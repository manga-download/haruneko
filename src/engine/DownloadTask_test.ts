import { mock, mockFn } from 'jest-mock-extended';
import { DownloadTask, IDownloadTask, Status } from './DownloadTask';
import type { IMediaContainer, IMediaItem } from './providers/MediaPlugin';

class TestFixture {

    private readonly MediaContainerEntriesMock = mockFn<() => IMediaItem[]>();
    public readonly MediaContainerMock = mock<IMediaContainer>();
    public readonly StatusChangedCallbackMock = mockFn<(sender: IDownloadTask, args: Status) => void>();
    public readonly ProgressChangedCallbackMock = mockFn<(sender: IDownloadTask, args: number) => void>();

    constructor() {
        const base = {};
        Object.defineProperty(base, 'Entries', { get: this.MediaContainerEntriesMock });
        this.MediaContainerMock = mock<IMediaContainer>(base);
    }

    public CreateTestee() {
        const testee = new DownloadTask(this.MediaContainerMock);
        testee.StatusChanged.Subscribe(this.StatusChangedCallbackMock);
        testee.ProgressChanged.Subscribe(this.ProgressChangedCallbackMock);
        return testee;
    }

    public SetupMediaContainer(items: IMediaItem[]): TestFixture {
        this.MediaContainerEntriesMock.mockReset();
        this.MediaContainerEntriesMock.mockReturnValue(items);
        return this;
    }
}

describe('DownloadTask', () => {

    describe('Constructor', () => {

        it('Should correctly initialize', async () => {
            const fixture = new TestFixture().SetupMediaContainer([]);
            const testee = fixture.CreateTestee();

            expect(Date.now() - testee.Created.getTime()).toBeLessThan(5);
            await new Promise(resolve => setTimeout(resolve, 5));
            expect(testee.Media).toBe(fixture.MediaContainerMock);
            expect(testee.Status).toBe(Status.Queued);
            expect(fixture.StatusChangedCallbackMock).not.toBeCalled();
            expect(testee.Progress).toBe(0);
            expect(fixture.ProgressChangedCallbackMock).not.toBeCalled();
        });
    });

    describe('Run', () => {

        it('Should process all entries in container on success', async () => {
            const page = mock<IMediaItem>();
            page.Fetch.mockReturnValue(Promise.resolve(null));
            const fixture = new TestFixture().SetupMediaContainer([ page, page, page, page ]);
            const testee = fixture.CreateTestee();

            const results = await testee.Run();

            expect(results).toBeUndefined();
            expect(fixture.MediaContainerMock.Update).toBeCalledTimes(1);
        });

        it('Should throw on error', async () => {
            const pageS = mock<IMediaItem>();
            pageS.Fetch.mockReturnValue(Promise.resolve(null));
            const pageE = mock<IMediaItem>();
            pageE.Fetch.mockReturnValue(Promise.reject(null));
            const fixture = new TestFixture().SetupMediaContainer([ pageS, pageE, pageS, pageE ]);
            const testee = fixture.CreateTestee();

            await expect(testee.Run()).rejects.toThrow();

            expect(fixture.MediaContainerMock.Update).toBeCalledTimes(1);
        });
    });

    describe('Status', () => {

        it('Should set expected value on success', async () => {
            const page = mock<IMediaItem>();
            page.Fetch.mockReturnValue(new Promise(resolve => setTimeout(resolve, 5)));
            const fixture = new TestFixture().SetupMediaContainer([ page ]);
            const testee = fixture.CreateTestee();

            expect(testee.Status).toBe(Status.Queued);
            const promise = testee.Run();
            expect(testee.Status).toBe(Status.Started);
            await promise;
            expect(testee.Status).toBe(Status.Completed);
        });

        it('Should set expected value on error', async () => {
            const page = mock<IMediaItem>();
            page.Fetch.mockReturnValue(new Promise((_, reject) => setTimeout(reject, 5)));
            const fixture = new TestFixture().SetupMediaContainer([ page ]);
            const testee = fixture.CreateTestee();

            expect(testee.Status).toBe(Status.Queued);
            const promise = testee.Run();
            expect(testee.Status).toBe(Status.Started);
            await expect(promise).rejects.toThrow();
            expect(testee.Status).toBe(Status.Failed);
        });
    });

    describe('StatusChanged', () => {

        it('Should invoke expected events on success', async () => {
            const page = mock<IMediaItem>();
            page.Fetch.mockReturnValue(Promise.resolve(null));
            const fixture = new TestFixture().SetupMediaContainer([ page ]);
            const testee = fixture.CreateTestee();

            await testee.Run();

            expect(fixture.StatusChangedCallbackMock).toBeCalledTimes(2);
            expect(fixture.StatusChangedCallbackMock).toHaveBeenNthCalledWith(1, testee, Status.Started);
            expect(fixture.StatusChangedCallbackMock).toHaveBeenNthCalledWith(2, testee, Status.Completed);
        });

        it('Should invoke expected events on error', async () => {
            const page = mock<IMediaItem>();
            page.Fetch.mockReturnValue(Promise.reject(null));
            const fixture = new TestFixture().SetupMediaContainer([ page ]);
            const testee = fixture.CreateTestee();

            await expect(testee.Run()).rejects.toThrow();

            expect(fixture.StatusChangedCallbackMock).toBeCalledTimes(2);
            expect(fixture.StatusChangedCallbackMock).toHaveBeenNthCalledWith(1, testee, Status.Started);
            expect(fixture.StatusChangedCallbackMock).toHaveBeenNthCalledWith(2, testee, Status.Failed);
        });
    });

    describe('Progress', () => {

        it('Should set expected value on progress', async () => {
            const page = mock<IMediaItem>();
            page.Fetch.mockReturnValue(new Promise(resolve => setTimeout(resolve, 5)));
            const fixture = new TestFixture().SetupMediaContainer([ page ]);
            const testee = fixture.CreateTestee();

            expect(testee.Progress).toBe(0);
            const promise = testee.Run();
            expect(testee.Progress).toBe(0);
            await promise;
            expect(testee.Progress).toBe(1);
        });

        it('Should set expected value on error', async () => {
            const pageS = mock<IMediaItem>();
            pageS.Fetch.mockReturnValue(new Promise((resolve, _) => setTimeout(resolve, 5)));
            const pageE = mock<IMediaItem>();
            pageE.Fetch.mockReturnValue(new Promise((_, reject) => setTimeout(reject, 5)));
            const fixture = new TestFixture().SetupMediaContainer([ pageS, pageE, pageS, pageE ]);
            const testee = fixture.CreateTestee();

            expect(testee.Progress).toBe(0);
            const promise = testee.Run();
            expect(testee.Progress).toBe(0);
            await expect(promise).rejects.toThrow();
            expect(testee.Progress).toBe(2/4);
        });
    });

    describe('ProgressChanged', () => {

        it('Should invoke expected events on success', async () => {
            const page = mock<IMediaItem>();
            page.Fetch.mockReturnValue(Promise.resolve(null));
            const fixture = new TestFixture().SetupMediaContainer([ page, page, page, page ]);
            const testee = fixture.CreateTestee();

            await testee.Run();

            const count = 4;
            expect(fixture.ProgressChangedCallbackMock).toBeCalledTimes(count);
            for(let page = 1; page <= count; page++) {
                expect(fixture.ProgressChangedCallbackMock).toHaveBeenNthCalledWith(page, testee, page/count);
            }
        });

        it('Should invoke expected events on error', async () => {
            const pageS = mock<IMediaItem>();
            pageS.Fetch.mockReturnValue(Promise.resolve(null));
            const pageE = mock<IMediaItem>();
            pageE.Fetch.mockReturnValue(Promise.reject(null));
            const fixture = new TestFixture().SetupMediaContainer([ pageS, pageE, pageS, pageE ]);
            const testee = fixture.CreateTestee();

            await expect(testee.Run()).rejects.toThrow();

            const count = 4;
            expect(fixture.ProgressChangedCallbackMock).toBeCalledTimes(2);
            expect(fixture.ProgressChangedCallbackMock).toHaveBeenNthCalledWith(1, testee, 1/count);
            expect(fixture.ProgressChangedCallbackMock).toHaveBeenNthCalledWith(2, testee, 2/count);
        });
    });
});