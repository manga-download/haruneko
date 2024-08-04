import '../ArrayExtensions';
import { mock } from 'vitest-mock-extended';
import { describe, it, expect } from 'vitest';
import { MediaContainer, type MediaChild } from './MediaPlugin';
import { MissingInfoTracker, type MediaInfoTracker } from '../trackers/IMediaInfoTracker';
import { Store, type StorageController } from '../StorageController';
import type { PluginController } from '../PluginController';
import type { InteractiveFileContentProvider } from '../InteractiveFileContentProvider';
import { BookmarkPlugin } from './BookmarkPlugin';
import { MissingWebsite, type Bookmark, type BookmarkSerialized } from './Bookmark';

class BlobProxy extends Blob {

    public readonly data: unknown;

    constructor(parts?: BlobPart[], options?: BlobPropertyBag) {
        super(parts, options);
        this.data = JSON.parse(parts[0] as string);
    }
}

global.Blob = BlobProxy;

class TestFixture {

    public static readonly DefaultStoredEntries: BookmarkSerialized[] = [
        {
            Created: 1,
            Updated: 1,
            Title: 'Bookmark 01',
            Media: {
                ProviderID: 'website-01',
                EntryID: 'website-01/manga'
            },
            Info: {
                ProviderID: 'tracker-01',
                EntryID: 'tracker-01/manga'
            },
        },
        {
            Created: 2,
            Updated: 2,
            Title: 'Bookmark 02',
            Media: {
                ProviderID: 'website-02',
                EntryID: 'website-02/manga'
            },
            Info: {
                ProviderID: 'tracker-02',
                EntryID: 'tracker-02/manga'
            },
        },
        {
            Created: 3,
            Updated: 3,
            Title: 'Bookmark 03',
            Media: {
                ProviderID: 'website-03',
                EntryID: 'website-03/manga'
            },
            Info: {
                ProviderID: null,
                EntryID: null
            },
        },
    ];
    public static readonly DefaultWebsitePlugins: MediaContainer<MediaChild>[] = [
        {
            Identifier: 'website-01',
            Title: 'Website 01',
            IsSameAs: MediaContainer.prototype.IsSameAs
        } as MediaContainer<MediaChild>
    ];
    public static readonly DefaultInfoTrackers: MediaInfoTracker[] = [
        {
            Identifier: 'tracker-01',
            Title: 'Tracker 01',
        } as MediaInfoTracker
    ];
    public readonly mockInteractiveFileContentProvider = mock<InteractiveFileContentProvider>();
    public readonly mockStorageController = mock<StorageController>();
    public readonly mockPluginController = mock<PluginController>();

    public SetupStoredBookmarks(bookmarks?: BookmarkSerialized[], delay = 0): TestFixture {
        this.mockStorageController.LoadPersistent.calledWith(Store.Bookmarks, undefined).mockReturnValue(new Promise(resolve => setTimeout(() => resolve(bookmarks ?? TestFixture.DefaultStoredEntries), delay)));
        return this;
    }

    public SetupWebsitePlugins(plugins?: MediaContainer<MediaChild>[]): TestFixture {
        Object.defineProperty(this.mockPluginController, 'WebsitePlugins', { get: () => plugins ?? TestFixture.DefaultWebsitePlugins });
        return this;
    }

    public SetupInfoTrackers(trackers?: MediaInfoTracker[]): TestFixture {
        Object.defineProperty(this.mockPluginController, 'InfoTrackers', { get: () => trackers ?? TestFixture.DefaultInfoTrackers });
        return this;
    }

    public async CreateTestee(delay = 25): Promise<BookmarkPlugin> {
        const testee = new BookmarkPlugin(this.mockStorageController, this.mockPluginController, this.mockInteractiveFileContentProvider);
        await new Promise(resolve => setTimeout(resolve, delay)); // Make sure bookmarks are loaded from async storage provider
        return testee;
    }
}

describe('BookmarkPlugin', () => {

    describe('Constructor', () => {

        it('Should load bookmarks from persistent storage', async () => {
            const fixture = new TestFixture()
                .SetupStoredBookmarks(TestFixture.DefaultStoredEntries, 25)
                .SetupWebsitePlugins()
                .SetupInfoTrackers();
            let updatedEntries: Bookmark[];
            const testee = await fixture.CreateTestee(0);
            testee.Entries.Subscribe(args => updatedEntries = args);
            await new Promise(resolve => setTimeout(resolve, 50));

            expect(testee.Entries.Value.length).toBe(3);
            expect(testee.Entries.Value).toBe(updatedEntries);

            let actual = testee.Entries.Value[0];
            expect(actual.Title).toBe('Bookmark 01');
            expect(actual.Identifier).toBe('website-01/manga');
            expect(actual.Parent).not.toBeInstanceOf(MissingWebsite);
            expect(actual.Parent.Identifier).toBe('website-01');
            expect(actual.Parent.Title).toBe('Website 01');
            expect(actual.Tracker).not.toBeInstanceOf(MissingInfoTracker);
            expect(actual.Tracker.Identifier).toBe('tracker-01');
            expect(actual.Tracker.Title).toBe('Tracker 01');
            expect(actual.InfoID).toBe('tracker-01/manga');

            actual = testee.Entries.Value[1];
            expect(actual.Title).toBe('Bookmark 02');
            expect(actual.Identifier).toBe('website-02/manga');
            expect(actual.Parent).toBeInstanceOf(MissingWebsite);
            expect(actual.Parent.Identifier).toBe('website-02');
            expect(actual.Parent.Title).toBe('website-02');
            expect(actual.Tracker).toBeInstanceOf(MissingInfoTracker);
            expect(actual.Tracker.Identifier).toBe('tracker-02');
            expect(actual.Tracker.Title).toBe('tracker-02');
            expect(actual.InfoID).toBe('tracker-02/manga');

            actual = testee.Entries.Value[2];
            expect(actual.Title).toBe('Bookmark 03');
            expect(actual.Identifier).toBe('website-03/manga');
            expect(actual.Parent).toBeInstanceOf(MissingWebsite);
            expect(actual.Parent.Identifier).toBe('website-03');
            expect(actual.Parent.Title).toBe('website-03');
            expect(actual.Tracker).toBeInstanceOf(MissingInfoTracker);
            expect(actual.Tracker.Identifier).toBeNull();
            expect(actual.Tracker.Title).toBeNull();
            expect(actual.InfoID).toBeNull();
        });
    });

    describe('Import', () => {

        it('Should successfully import bookmarks', async () => {
            const fixture = new TestFixture()
                .SetupStoredBookmarks()
                .SetupWebsitePlugins()
                .SetupInfoTrackers();
            const file = mock<Blob>();
            fixture.mockInteractiveFileContentProvider.LoadFile.mockResolvedValue(file);
            file.text.mockResolvedValue(`[
                {
                    "Title": "Bookmark 1001",
                    "Created": 1.1, "Updated": 1.2,
                    "Media": { "ProviderID": "website-01", "EntryID": "website-01/manga" },
                    "Info": { "ProviderID": null, "EntryID": null }
                },
                {
                    "Title": "Bookmark 1002",
                    "Created": 2.1, "Updated": 2.2,
                    "Media": { "ProviderID": "website-01", "EntryID": "website-01/anime" },
                    "Info": { "ProviderID": "tracker-01", "EntryID": "tracker-01/anime" }
                },
                {
                    "Title": "Bookmark 1003",
                    "Created": 3.1, "Updated": 3.2,
                    "Media": { "ProviderID": "website-02", "EntryID": "website-02/anime" },
                    "Info": { "ProviderID": null, "EntryID": null }
                }
            ]`);
            const testee = await fixture.CreateTestee();
            fixture.mockStorageController.LoadPersistent.mockClear();
            const actual = await testee.Import();

            expect(actual.cancelled).toBe(false);
            expect(actual.found).toBe(3);
            expect(actual.imported).toBe(2);
            expect(actual.skipped).toBe(1);
            expect(actual.broken).toBe(1);

            expect(fixture.mockStorageController.LoadPersistent).toBeCalledTimes(1);
            expect(fixture.mockStorageController.SavePersistent).toBeCalledTimes(2);
            expect(fixture.mockStorageController.SavePersistent).toBeCalledWith({
                Title: 'Bookmark 1002',
                Created: 2, Updated: 2,
                Media: { EntryID: 'website-01/anime', ProviderID: 'website-01' },
                Info: { EntryID: 'tracker-01/anime', ProviderID: 'tracker-01' },
            }, Store.Bookmarks, 'website-01 :: website-01/anime');
            expect(fixture.mockStorageController.SavePersistent).toBeCalledWith({
                Title: 'Bookmark 1003',
                Created: 3, Updated: 3,
                Media: { EntryID: 'website-02/anime', ProviderID: 'website-02' },
                Info: { EntryID: null, ProviderID: null },
            }, Store.Bookmarks, 'website-02 :: website-02/anime');
        });

        it('Should successfully import legacy bookmarks', async () => {
            const fixture = new TestFixture()
                .SetupStoredBookmarks()
                .SetupWebsitePlugins()
                .SetupInfoTrackers();
            const file = mock<Blob>();
            fixture.mockInteractiveFileContentProvider.LoadFile.mockResolvedValue(file);
            file.text.mockResolvedValue(`[
                {
                    "title": {
                        "connector": "❓",
                        "manga": "Bookmark 1001"
                    },
                    "key": {
                        "connector": "website-01",
                        "manga": "website-01/manga"
                    }
                },
                {
                    "title": {
                        "connector": "❓",
                        "manga": "Bookmark 1002"
                    },
                    "key": {
                        "connector": "website-01",
                        "manga": "website-01/anime"
                    }
                },
                {
                    "title": {
                        "connector": "❓",
                        "manga": "Bookmark 1003"
                    },
                    "key": {
                        "connector": "website-02",
                        "manga": "website-02/anime"
                    }
                }
            ]`);
            const testee = await fixture.CreateTestee();
            fixture.mockStorageController.LoadPersistent.mockClear();
            const actual = await testee.Import();

            expect(actual.cancelled).toBe(false);
            expect(actual.found).toBe(3);
            expect(actual.imported).toBe(2);
            expect(actual.skipped).toBe(1);
            expect(actual.broken).toBe(1);

            expect(fixture.mockStorageController.LoadPersistent).toBeCalledTimes(1);
            expect(fixture.mockStorageController.SavePersistent).toBeCalledTimes(2);
            expect(fixture.mockStorageController.SavePersistent).toBeCalledWith({
                Title: 'Bookmark 1002',
                Created: 0, Updated: 0,
                Media: { EntryID: 'website-01/anime', ProviderID: 'website-01' },
                Info: { EntryID: null, ProviderID: null },
            }, Store.Bookmarks, 'website-01 :: website-01/anime');
            expect(fixture.mockStorageController.SavePersistent).toBeCalledWith({
                Title: 'Bookmark 1003',
                Created: 0, Updated: 0,
                Media: { EntryID: 'website-02/anime', ProviderID: 'website-02' },
                Info: { EntryID: null, ProviderID: null },
            }, Store.Bookmarks, 'website-02 :: website-02/anime');
        });

        it('Should do nothing when import is cancelled by user', async () => {
            const fixture = new TestFixture()
                .SetupStoredBookmarks()
                .SetupWebsitePlugins()
                .SetupInfoTrackers();
            fixture.mockInteractiveFileContentProvider.LoadFile.mockRejectedValue(new DOMException('😈', 'AbortError'));
            fixture.mockInteractiveFileContentProvider.IsAbortError.mockReturnValue(true);
            const testee = await fixture.CreateTestee();
            const actual = await testee.Import();

            expect(actual.cancelled).toBe(true);
            expect(actual.found).toBe(0);
            expect(actual.imported).toBe(0);
            expect(actual.skipped).toBe(0);
            expect(actual.broken).toBe(0);
            expect(fixture.mockStorageController.SavePersistent).not.toBeCalled();
        });

        it('Should throw on unexpected error', async () => {
            const fixture = new TestFixture()
                .SetupStoredBookmarks()
                .SetupWebsitePlugins()
                .SetupInfoTrackers();
            const expected = new Error('😈');
            fixture.mockInteractiveFileContentProvider.LoadFile.mockRejectedValue(expected);
            fixture.mockInteractiveFileContentProvider.IsAbortError.mockReturnValue(false);
            const testee = await fixture.CreateTestee();

            expect(testee.Import()).rejects.toBe(expected);
            expect(fixture.mockStorageController.SavePersistent).not.toBeCalled();
        });
    });

    describe('Export', () => {

        it('Should successfully export bookmarks', async () => {
            const fixture = new TestFixture()
                .SetupStoredBookmarks()
                .SetupWebsitePlugins()
                .SetupInfoTrackers();
            const today = new Date(Date.now() - 60000 * new Date().getTimezoneOffset()).toISOString().split('T').shift();
            const testee = await fixture.CreateTestee();
            const actual = await testee.Export();

            expect(actual.cancelled).toBe(false);
            expect(actual.exported).toBe(3);
            expect(fixture.mockInteractiveFileContentProvider.SaveFile).toBeCalledWith(expect.objectContaining({ data: TestFixture.DefaultStoredEntries }), {
                suggestedName: `HakuNeko (${today}).bookmarks`,
                types: [
                    {
                        accept: {
                            'application/json': [ '.bookmarks' ]
                        },
                        description: 'HakuNeko Bookmarks'
                    }
                ]});
        });

        it('Should do nothing when export is cancelled by user', async () => {
            const fixture = new TestFixture()
                .SetupStoredBookmarks()
                .SetupWebsitePlugins()
                .SetupInfoTrackers();
            fixture.mockInteractiveFileContentProvider.SaveFile.mockRejectedValue(new DOMException('😈', 'AbortError'));
            fixture.mockInteractiveFileContentProvider.IsAbortError.mockReturnValue(true);
            const testee = await fixture.CreateTestee();
            const actual = await testee.Export();

            expect(actual.cancelled).toBe(true);
            expect(actual.exported).toBe(0);
            expect(fixture.mockInteractiveFileContentProvider.SaveFile).toBeCalled();
        });

        it('Should throw on unexpected error', async () => {
            const fixture = new TestFixture()
                .SetupStoredBookmarks()
                .SetupWebsitePlugins()
                .SetupInfoTrackers();
            const expected = new Error('😈');
            fixture.mockInteractiveFileContentProvider.SaveFile.mockRejectedValue(expected);
            fixture.mockInteractiveFileContentProvider.IsAbortError.mockReturnValue(false);
            const testee = await fixture.CreateTestee();

            expect(testee.Export()).rejects.toBe(expected);
        });
    });
});