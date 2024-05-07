import { mock } from 'vitest-mock-extended';
import { vi, describe, it, expect } from 'vitest';
import { DownloadManager } from './DownloadManager';
import { type MediaContainer, StoreableMediaContainer, type MediaChild, type MediaItem } from './providers/MediaPlugin';
import type { SettingsManager } from './SettingsManager';
import type { StorageController } from './StorageController';

function MockContainer(identifier: string, parent: MediaContainer<MediaChild> = undefined) {
    const base = {};
    Object.defineProperty(base, 'Parent', { get: () => parent });
    Object.defineProperty(base, 'Identifier', { get: () => identifier });
    const container = mock<StoreableMediaContainer<MediaItem>>(base);
    container.IsSameAs.mockImplementation(StoreableMediaContainer.prototype.IsSameAs.bind(base));
    return container;
}

class TestFixture {

    public readonly StorageControllerMock = mock<StorageController>();
    public readonly SettingsManagerMock = mock<SettingsManager>();

    public CreateTestee() {
        return new DownloadManager(this.StorageControllerMock);
    }
}

describe('DownloadManager', () => {

    describe('Constructor', () => {

        it('Should correctly initialize', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();

            expect(testee).toBeInstanceOf(DownloadManager);
        });
    });

    describe('GetTasks', () => {

        it('Should be empty by default', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();

            const tasks = await testee.GetTasks();

            expect(tasks.length).toBe(0);
        });

        it('Should get all enqueued tasks', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();

            await testee.Enqueue(MockContainer('①'), MockContainer('②'));
            await testee.Enqueue(MockContainer('③'));
            const tasks = await testee.GetTasks();

            expect(tasks.length).toBe(3);
        });
    });

    describe('Enqueue', () => {

        it('Should add distinct containers', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();

            const expected = [ '①', '②', '③' ].map(id => MockContainer(id));
            await testee.Enqueue(...expected);

            const queued = (await testee.GetTasks()).map(task => task.Media);
            expect(queued).toStrictEqual(expected);
        });

        it('Should only add first unique containers', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();

            const expected = [ '①', '②', '③' ].map(id => MockContainer(id));
            await testee.Enqueue(...expected, MockContainer('②'), MockContainer('③'), MockContainer('①'));

            const queued = (await testee.GetTasks()).map(task => task.Media);
            expect(queued).toStrictEqual(expected);
        });

        it('Should not add duplicate containers', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();

            const expected = [ '①', '②', '③' ].map(id => MockContainer(id));
            await testee.Enqueue(...expected);
            await testee.Enqueue(MockContainer('②'), MockContainer('③'), MockContainer('①'));

            const queued = (await testee.GetTasks()).map(task => task.Media);
            expect(queued).toStrictEqual(expected);
        });

        it('Should add containers with different root nodes', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();

            const first = MockContainer('②', MockContainer('①', MockContainer('x')));
            const second = MockContainer('②', MockContainer('①', MockContainer('o')));
            await testee.Enqueue(first);
            await testee.Enqueue(second);

            const queued = (await testee.GetTasks()).map(task => task.Media);
            expect(queued).toStrictEqual([ first, second ]);
        });

        it('Should not add containers with subsequent parent equality', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();

            const first = MockContainer('③', MockContainer('②'));
            const second = MockContainer('③', MockContainer('②', MockContainer('①')));
            await testee.Enqueue(first);
            await testee.Enqueue(second);

            const queued = (await testee.GetTasks()).map(task => task.Media);
            expect(queued).toStrictEqual([ first ]);
        });

        it('Should not add containers with subsequent parent equality', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();

            const first = MockContainer('③', MockContainer('②', MockContainer('①')));
            const second = MockContainer('③', MockContainer('②'));
            await testee.Enqueue(first);
            await testee.Enqueue(second);

            const queued = (await testee.GetTasks()).map(task => task.Media);
            expect(queued).toStrictEqual([ first ]);
        });

        it('Should not add containers with equivalent parents', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();

            const first = MockContainer('③', MockContainer('②', MockContainer('①')));
            const second = MockContainer('③', MockContainer('②', MockContainer('①')));
            await testee.Enqueue(first);
            await testee.Enqueue(second);

            const queued = (await testee.GetTasks()).map(task => task.Media);
            expect(queued).toStrictEqual([ first ]);
        });

    });

    describe('Dequeue', () => {

        it('Should remove tasks from download queue', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();

            await testee.Enqueue(MockContainer('①'), MockContainer('②'), MockContainer('③'), MockContainer('④'));
            const tasks = await testee.GetTasks();
            await testee.Dequeue(tasks[1], tasks[2]);

            const queued = await testee.GetTasks();
            expect(queued).toStrictEqual([ tasks[0], tasks[3] ]);
        });
    });

    describe('TasksAdded', () => {

        it('Should invoke expected event with all added tasks', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();

            const callback = vi.fn();
            const containers = [ '①', '②', '③' ].map(id => MockContainer(id));
            testee.TasksAdded.Subscribe(callback);
            await testee.Enqueue(...containers);
            const tasks = await testee.GetTasks();

            expect(callback).toBeCalledTimes(1);
            expect(callback).toBeCalledWith(testee, tasks);
        });

        it('Should invoke expected event with only new tasks added (in given order)', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();

            const callback = vi.fn();
            const containers = [ '①', '②', '③' ].map(id => MockContainer(id));
            await testee.Enqueue(MockContainer('②'), MockContainer('x'), MockContainer('o'));
            testee.TasksAdded.Subscribe(callback);
            await testee.Enqueue(containers[2], containers[1], containers[0]);
            const tasks = await testee.GetTasks();

            expect(callback).toBeCalledTimes(1);
            expect(callback).toBeCalledWith(testee, tasks.slice(-2));
            expect(tasks.slice(-2).map(task => task.Media)).toStrictEqual([ containers[2], containers[0] ]);
        });
    });

    describe('TasksRemoved', () => {

        it('Should invoke expected event with all removed tasks', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();

            const callback = vi.fn();
            const containers = [ '①', '②', '③', '④' ].map(id => MockContainer(id));
            testee.TasksRemoved.Subscribe(callback);
            await testee.Enqueue(...containers);
            const tasks = await testee.GetTasks();
            await testee.Dequeue(tasks[1], tasks[2]);

            expect(callback).toBeCalledTimes(1);
            expect(callback).toBeCalledWith(testee, tasks.slice(1, 3));
        });

        it('Should invoke expected event with only existing tasks removed (in given order)', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();

            const callback = vi.fn();
            const containers = [ '①', '②', '③', '④' ].map(id => MockContainer(id));
            await testee.Enqueue(...containers);
            const tasks = await testee.GetTasks();
            await testee.Dequeue(tasks[3]);
            testee.TasksRemoved.Subscribe(callback);
            await testee.Dequeue(tasks[3], tasks[2], tasks[1]);

            expect(callback).toBeCalledTimes(1);
            expect(callback).toBeCalledWith(testee, [ tasks[1], tasks[2] ]);
            expect(tasks.slice(1, 3).map(task => task.Media)).toStrictEqual([ containers[1], containers[2] ]);
        });
    });
});