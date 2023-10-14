import { mock } from 'jest-mock-extended';
import { MediaContainer, type IMediaContainer } from './MediaPlugin';
import type { IMediaInfoTracker } from '../trackers/IMediaInfoTracker';
import { Store, type StorageController } from '../StorageController';
import type { PluginController } from '../PluginController';
import type { InteractiveFileContentProvider } from '../InteractiveFileContentProvider';
import { BookmarkPlugin } from './BookmarkPlugin';
import { MissingWebsite, type Bookmark, type BookmarkSerialized } from './Bookmark';

class TestFixture {

    public static readonly DefaultStoredEntries: BookmarkSerialized[] = [
        {
            Created: 1.1,
            Updated: 1.2,
            Title: 'Bookmark 01',
            Media: {
                ProviderID: 'website-01',
                EntryID: 'website-01/manga'
            },
            Info: {
                ProviderID: 'tracker-01',
                EntryID: 'tracker-01/manga'
            },
            LastKnownEntries: {
                IdentifierHashes: [],
                TitleHashes: []
            },
        },
        {
            Created: 2.1,
            Updated: 2.2,
            Title: 'Bookmark 02',
            Media: {
                ProviderID: 'website-02',
                EntryID: 'website-02/manga'
            },
            Info: {
                ProviderID: 'tracker-02',
                EntryID: 'tracker-02/manga'
            },
            LastKnownEntries: {
                IdentifierHashes: [],
                TitleHashes: []
            },
        },
        {
            Created: 3.1,
            Updated: 3.2,
            Title: 'Bookmark 03',
            Media: {
                ProviderID: 'website-03',
                EntryID: 'website-03/manga'
            },
            Info: {
                ProviderID: null,
                EntryID: null
            },
            LastKnownEntries: {
                IdentifierHashes: [],
                TitleHashes: []
            },
        },
    ];
    public static readonly DefaultWebsitePlugins: IMediaContainer[] = [
        {
            Identifier: 'website-01',
            Title: 'Website 01',
            IsSameAs: MediaContainer.prototype.IsSameAs
        } as IMediaContainer
    ];
    public static readonly DefaultInfoTrackers: IMediaInfoTracker[] = [
        {
            Identifier: 'tracker-01',
            Title: 'Tracker 01',
        } as IMediaInfoTracker
    ];
    public readonly mockInteractiveFileContentProvider = mock<InteractiveFileContentProvider>();
    public readonly mockStorageController = mock<StorageController>();
    public readonly mockPluginController = mock<PluginController>();

    public SetupStoredBookmarks(bookmarks?: BookmarkSerialized[], delay = 0): TestFixture {
        this.mockStorageController.LoadPersistent.calledWith(Store.Bookmarks, undefined).mockReturnValue(new Promise(resolve => setTimeout(() => resolve(bookmarks ?? TestFixture.DefaultStoredEntries), delay)));
        return this;
    }

    public SetupWebsitePlugins(plugins?: IMediaContainer[]): TestFixture {
        Object.defineProperty(this.mockPluginController, 'WebsitePlugins', { get: () => plugins ?? TestFixture.DefaultWebsitePlugins });
        return this;
    }

    public SetupInfoTrackers(trackers?: IMediaInfoTracker[]): TestFixture {
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

        test('Should load bookmarks from persistent storage', async () => {
            const fixture = new TestFixture()
                .SetupStoredBookmarks(TestFixture.DefaultStoredEntries, 25)
                .SetupWebsitePlugins()
                .SetupInfoTrackers();
            let updatedEntries: Bookmark[];
            const testee = await fixture.CreateTestee(0);
            testee.EntriesUpdated.Subscribe((_, args) => updatedEntries = args);
            await new Promise(resolve => setTimeout(resolve, 50));

            expect(testee.Entries.length).toBe(3);
            expect(testee.Entries).toBe(updatedEntries);

            expect(testee.Entries[0].Title).toBe('Bookmark 01');
            expect(testee.Entries[0].Identifier).toBe('website-01/manga');
            expect(testee.Entries[0].Parent).not.toBeInstanceOf(MissingWebsite);
            expect(testee.Entries[0].Parent.Identifier).toBe('website-01');
            expect(testee.Entries[0].Parent.Title).toBe('Website 01');
            expect(testee.Entries[0].Tracker.Identifier).toBe('tracker-01');
            expect(testee.Entries[0].Tracker.Title).toBe('Tracker 01');
            expect(testee.Entries[0].InfoID).toBe('tracker-01/manga');

            expect(testee.Entries[1].Title).toBe('Bookmark 02');
            expect(testee.Entries[1].Identifier).toBe('website-02/manga');
            expect(testee.Entries[1].Parent).toBeInstanceOf(MissingWebsite);
            expect(testee.Entries[1].Parent.Identifier).toBe('website-02');
            expect(testee.Entries[1].Parent.Title).toBe('website-02');
            expect(testee.Entries[1].Tracker).toBeNull();
            expect(testee.Entries[1].InfoID).toBe('tracker-02/manga');

            expect(testee.Entries[2].Title).toBe('Bookmark 03');
            expect(testee.Entries[2].Identifier).toBe('website-03/manga');
            expect(testee.Entries[2].Parent).toBeInstanceOf(MissingWebsite);
            expect(testee.Entries[2].Parent.Identifier).toBe('website-03');
            expect(testee.Entries[2].Parent.Title).toBe('website-03');
            expect(testee.Entries[2].Tracker).toBeNull();
            expect(testee.Entries[2].InfoID).toBeNull();
        });
    });

    describe('Import', () => {

        test('Should successfully import bookmarks', async () => {
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
                    "Info": { "ProviderID": null, "EntryID": null },
                    "LastKnownEntries": { "IdentifierHashes": [], "TitleHashes": [] }
                },
                {
                    "Title": "Bookmark 1002",
                    "Created": 2.1, "Updated": 2.2,
                    "Media": { "ProviderID": "website-01", "EntryID": "website-01/anime" },
                    "Info": { "ProviderID": "tracker-01", "EntryID": "tracker-01/anime" },
                    "LastKnownEntries": { "IdentifierHashes": [], "TitleHashes": [] }
                },
                {
                    "Title": "Bookmark 1003",
                    "Created": 3.1, "Updated": 3.2,
                    "Media": { "ProviderID": "website-02", "EntryID": "website-02/anime" },
                    "Info": { "ProviderID": null, "EntryID": null },
                    "LastKnownEntries": { "IdentifierHashes": [], "TitleHashes": [] }
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
                LastKnownEntries: { IdentifierHashes: [], TitleHashes: [] },
            }, Store.Bookmarks, 'website-01 :: website-01/anime');
            expect(fixture.mockStorageController.SavePersistent).toBeCalledWith({
                Title: 'Bookmark 1003',
                Created: 3, Updated: 3,
                Media: { EntryID: 'website-02/anime', ProviderID: 'website-02' },
                Info: { EntryID: null, ProviderID: null },
                LastKnownEntries: { IdentifierHashes: [], TitleHashes: [] },
            }, Store.Bookmarks, 'website-02 :: website-02/anime');
        });

        test('Should successfully import legacy bookmarks', async () => {
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
                LastKnownEntries: { IdentifierHashes: [], TitleHashes: [] },
            }, Store.Bookmarks, 'website-01 :: website-01/anime');
            expect(fixture.mockStorageController.SavePersistent).toBeCalledWith({
                Title: 'Bookmark 1003',
                Created: 0, Updated: 0,
                Media: { EntryID: 'website-02/anime', ProviderID: 'website-02' },
                Info: { EntryID: null, ProviderID: null },
                LastKnownEntries: { IdentifierHashes: [], TitleHashes: [] },
            }, Store.Bookmarks, 'website-02 :: website-02/anime');
        });

        test('Should do nothing when import is cancelled by user', async () => {
            const fixture = new TestFixture()
                .SetupStoredBookmarks()
                .SetupWebsitePlugins()
                .SetupInfoTrackers();
            fixture.mockInteractiveFileContentProvider.LoadFile.mockRejectedValue(new DOMException('😈', 'AbortError'));
            const testee = await fixture.CreateTestee();
            const actual = await testee.Import();

            expect(actual.cancelled).toBe(true);
            expect(fixture.mockStorageController.SavePersistent).not.toBeCalled();
        });

        test('Should throw on unexpected error', async () => {
            const fixture = new TestFixture()
                .SetupStoredBookmarks()
                .SetupWebsitePlugins()
                .SetupInfoTrackers();
            const expected = new Error('😈');
            fixture.mockInteractiveFileContentProvider.LoadFile.mockRejectedValue(expected);
            const testee = await fixture.CreateTestee();

            expect(testee.Import()).rejects.toBe(expected);
            expect(fixture.mockStorageController.SavePersistent).not.toBeCalled();
        });
    });

    describe('Export', () => {

        test('Should successfully export bookmarks', async () => {
            const fixture = new TestFixture()
                .SetupStoredBookmarks()
                .SetupWebsitePlugins()
                .SetupInfoTrackers();
            const testee = await fixture.CreateTestee();
            await testee.Export();

            // TODO: Is it possible to assert the text() of the Blob?
            expect(fixture.mockInteractiveFileContentProvider.SaveFile).toBeCalledWith(new Blob(), {
                suggestedName: 'HakuNeko (2023-10-14).bookmarks',
                types: [
                    {
                        accept: {
                            'application/json': [ '.bookmarks' ]
                        },
                        description: 'HakuNeko Bookmarks'
                    }
                ]});
        });

        test('Should do nothing when export is cancelled by user', async () => {
            const fixture = new TestFixture()
                .SetupStoredBookmarks()
                .SetupWebsitePlugins()
                .SetupInfoTrackers();
            fixture.mockInteractiveFileContentProvider.SaveFile.mockRejectedValue(new DOMException('😈', 'AbortError'));
            const testee = await fixture.CreateTestee();
            await testee.Export();

            expect(fixture.mockInteractiveFileContentProvider.SaveFile).toBeCalled();
        });

        test('Should throw on unexpected error', async () => {
            const fixture = new TestFixture()
                .SetupStoredBookmarks()
                .SetupWebsitePlugins()
                .SetupInfoTrackers();
            const expected = new Error('😈');
            fixture.mockInteractiveFileContentProvider.SaveFile.mockRejectedValue(expected);
            const testee = await fixture.CreateTestee();

            expect(testee.Export()).rejects.toBe(expected);
        });
    });
});