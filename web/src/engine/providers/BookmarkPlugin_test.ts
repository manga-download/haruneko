import { mock } from 'jest-mock-extended';
import type { IMediaContainer } from './MediaPlugin';
import type { IMediaInfoTracker } from '../trackers/IMediaInfoTracker';
import { Store, type StorageController } from '../StorageController';
import type { PluginController } from '../PluginController';
import type { InteractiveFileContentProvider } from '../InteractiveFileContentProvider';
import { BookmarkPlugin } from './BookmarkPlugin';
import type { Bookmark, BookmarkSerialized } from './Bookmark';

class TestFixture {

    public readonly DefaultStoredEntries: BookmarkSerialized[] = [
        {
            Created: 1,
            Updated: 2,
            Title: 'Bookmark ✔️',
            Media: {
                ProviderID: 'website-exists',
                EntryID: 'website-exists/manga'
            },
            Info: {
                ProviderID: 'tracker-exists',
                EntryID: 'tracker-exists/manga'
            },
            LastKnownEntries: {
                IdentifierHashes: [],
                TitleHashes: []
            },
        },
        {
            Created: 3,
            Updated: 4,
            Title: 'Bookmark ❌',
            Media: {
                ProviderID: 'website-missing',
                EntryID: 'website-missing/manga'
            },
            Info: {
                ProviderID: 'tracker-missing',
                EntryID: 'tracker-missing/manga'
            },
            LastKnownEntries: {
                IdentifierHashes: [],
                TitleHashes: []
            },
        },
    ];
    public DefaultWebsitePlugins: IMediaContainer[] = [
        {
            Identifier: 'website-exists',
            Title: 'Website (exists)',
        } as IMediaContainer
    ];
    public DefaultInfoTrackers: IMediaInfoTracker[] = [
        {
            Identifier: 'tracker-exists',
            Title: 'Tracker (exists)',
        } as IMediaInfoTracker
    ];
    public readonly mockInteractiveFileContentProvider = mock<InteractiveFileContentProvider>();
    public readonly mockStorageController = mock<StorageController>();
    public readonly mockPluginController = mock<PluginController>();

    public SetupStoredBookmarks(bookmarks?: BookmarkSerialized[]): TestFixture {
        this.mockStorageController.LoadPersistent.calledWith(Store.Bookmarks, undefined).mockReturnValue(Promise.resolve(bookmarks ?? this.DefaultStoredEntries));
        return this;
    }

    public SetupWebsitePlugins(plugins?: IMediaContainer[]): TestFixture {
        Object.defineProperty(this.mockPluginController, 'WebsitePlugins', { get: () => plugins ?? this.DefaultWebsitePlugins });
        return this;
    }

    public SetupInfoTrackers(trackers?: IMediaInfoTracker[]): TestFixture {
        Object.defineProperty(this.mockPluginController, 'InfoTrackers', { get: () => trackers ?? this.DefaultInfoTrackers });
        return this;
    }

    public CreateTestee() {
        return new BookmarkPlugin(this.mockStorageController, this.mockPluginController, this.mockInteractiveFileContentProvider);
    }
}

describe('BookmarkPlugin', () => {

    describe('Constructor', () => {

        test('Should load bookmarks from persitent storage', async () => {
            const fixture = new TestFixture().SetupStoredBookmarks();
            let updatedEntries: Bookmark[];
            const testee = fixture.CreateTestee();
            testee.EntriesUpdated.Subscribe((_, args) => updatedEntries = args);
            await new Promise(resolve => setTimeout(resolve, 50));

            expect(testee.Entries).toBe(updatedEntries);
            expect(testee.Entries.length).toBe(2);

            expect(testee.Entries[0].Title).toBe('Bookmark ✔️');
            expect(testee.Entries[0].Identifier).toBe('website-exists/manga');
            expect(testee.Entries[0].Parent.Identifier).toBe('website-exists');
            expect(testee.Entries[0].Parent.Title).toBe('Website (exists)');
            expect(testee.Entries[0].Tracker.Identifier).toBe('tracker-exists');
            expect(testee.Entries[0].Tracker.Title).toBe('Tracker (exists)');
            expect(testee.Entries[0].InfoID).toBe('tracker-exists/manga');

            expect(testee.Entries[1].Title).toBe('Bookmark ❌');
            expect(testee.Entries[1].Identifier).toBe('website-missing/manga');
            expect(testee.Entries[1].Parent.Identifier).toBe('website-missing');
            expect(testee.Entries[1].Parent.Title).toBe('website-missing');
            console.log('Tracker:', testee.Entries[1].Tracker);
            expect(testee.Entries[1].Tracker).toBeUndefined();
            expect(testee.Entries[1].InfoID).toBe('tracker-missing/manga');
        });
    });

    describe('Import', () => {

        test('Should successfully import supported bookmarks', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();
            await testee.Import();
        });

        test('Should throw when importing invalid bookmarks', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();
            await testee.Import();
        });
    });

    describe('Export', () => {

        test('Should successfully export supported bookmarks', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();
            await testee.Export();
        });

        test('Should throw when exporting invalid bookmarks', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();
            await testee.Export();
        });
    });
});