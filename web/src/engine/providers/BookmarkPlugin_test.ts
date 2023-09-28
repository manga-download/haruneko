import { mock } from 'jest-mock-extended';
import type { IMediaChild, IMediaContainer } from './MediaPlugin';
import { Bookmark, BookmarkPlugin } from './BookmarkPlugin';
import type { IMediaInfoTracker } from '../trackers/IMediaInfoTracker';
import { Store, type StorageController } from '../StorageController';
import type { PluginController } from '../PluginController';

class TestFixture {

    public readonly CreationTime = 123456;
    public readonly ModificationTime = 654321;
    public readonly OriginIdentifier = 'sheepyneko';
    public readonly OriginTitle = 'Sheepy Neko';
    public readonly MockParent = mock<IMediaContainer>();
    public readonly MockOrigin: IMediaChild;
    public readonly MockInfoTracker = mock<IMediaInfoTracker>();
    public readonly InfoIdentifier = 'sheepyneko@info-tracker';
    public readonly LastKnownEntries = {
        IdentifierHashes: [] as string[],
        TitleHashes: [] as string[]
    };

    constructor() {
        //this.MockParent.CreateEntry.calledWith(this.OriginIdentifier, this.OriginTitle).mockReturnValue(this.MockOrigin);
    }

    /*
    public SetupOrigin(identifier: string, title: string): TestFixture {
        return this;
    }
    */

    /*
    public SetupInfoTracking(infoID: string) {

    }
    */

    public SetupLastKnownEntries(identifierHashes: string[], titleHashes: string[]): TestFixture {
        this.LastKnownEntries.IdentifierHashes = identifierHashes;
        this.LastKnownEntries.TitleHashes = titleHashes;
        return this;
    }

    public CreateSparseTestee() {
        return new Bookmark(new Date(this.CreationTime), new Date(this.ModificationTime), this.MockParent, this.OriginIdentifier, this.OriginTitle);
    }

    public CreateTestee() {
        return new Bookmark(new Date(this.CreationTime), new Date(this.ModificationTime), this.MockParent, this.OriginIdentifier, this.OriginTitle, this.LastKnownEntries, this.MockInfoTracker, this.InfoIdentifier);
    }
}

describe('Bookmark', () => {

    describe('Constructor', () => {

        it('Should correctly assign mandatory parameters', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateSparseTestee();

            expect(testee.Created.getTime()).toBe(fixture.CreationTime);
            expect(testee.Updated.getTime()).toBe(fixture.ModificationTime);
            expect(testee.Identifier).toBe(fixture.OriginIdentifier);
            expect(testee.Title).toBe(fixture.OriginTitle);
            expect(testee.Parent).toBe(fixture.MockParent);
            expect(testee.LastKnownEntries.IdentifierHashes.length).toBe(0);
            expect(testee.LastKnownEntries.TitleHashes.length).toBe(0);
            expect(testee.Tracker).toBeUndefined();
            expect(testee.InfoID).toBeUndefined();
        });

        it('Should correctly assign optional parameters', async () => {
            const expectedLastKnownEntries = {
                IdentifierHashes: [ '-' ],
                TitleHashes: [ '+' ]
            };
            const fixture = new TestFixture().SetupLastKnownEntries(expectedLastKnownEntries.IdentifierHashes, expectedLastKnownEntries.TitleHashes);
            const testee = fixture.CreateTestee();

            expect(testee.Created.getTime()).toBe(fixture.CreationTime);
            expect(testee.Updated.getTime()).toBe(fixture.ModificationTime);
            expect(testee.Identifier).toBe(fixture.OriginIdentifier);
            expect(testee.Title).toBe(fixture.OriginTitle);
            expect(testee.Parent).toBe(fixture.MockParent);
            expect(testee.LastKnownEntries).toStrictEqual(expectedLastKnownEntries);
            expect(testee.Tracker).toBe(fixture.MockInfoTracker);
            expect(testee.InfoID).toBe(fixture.InfoIdentifier);
        });
    });

    describe('Entries', () => {

        it('Should find existing origin in parent and pass-through entries from origin', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateSparseTestee();

            const entries = mock<IMediaContainer[]>();
            const origin = mock<IMediaContainer>();
            Object.defineProperty(origin, 'Identifier', { get: () => testee.Identifier });
            Object.defineProperty(origin, 'Entries', { get: () => entries });

            const children = [ origin ];
            Object.defineProperty(fixture.MockParent, 'Entries', { get: () => children });

            const actual = testee.Entries;

            expect(actual).toBe(entries);
            expect(children[0]).toBe(origin);
            expect(fixture.MockParent.Entries[0]).toBe(origin);
            expect(fixture.MockParent.CreateEntry).toHaveBeenCalledTimes(0);
        });

        it('Should create non-existing origin once and pass-through the same instance', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateSparseTestee();

            const entries = mock<IMediaContainer[]>();
            const origin = mock<IMediaContainer>();
            Object.defineProperty(origin, 'Identifier', { get: () => testee.Identifier });
            Object.defineProperty(origin, 'Entries', { get: () => entries });

            const children = [];
            fixture.MockParent.CreateEntry.calledWith(testee.Identifier, testee.Title).mockReturnValue(origin);
            Object.defineProperty(fixture.MockParent, 'Entries', { get: () => children });

            // Multiple calls to internal `Origin` getter to verify that `CreateEntry` is only called once
            const actual = testee.Entries || testee.Entries || testee.Entries;

            expect(actual).toBe(entries);
            expect(children.length).toBe(0);
            expect(fixture.MockParent.Entries.length).toBe(0);
            expect(fixture.MockParent.CreateEntry).toHaveBeenCalledTimes(1);
            expect(fixture.MockParent.CreateEntry).toHaveBeenCalledWith(testee.Identifier, testee.Title);
        });
    });
});

describe('BookmarkPlugin', () => {

    describe('Constructor', () => {

        test('Should load bookmarks from persitent storage', async () => {
            const mockStorageController = mock<StorageController>();
            mockStorageController.LoadPersistent.calledWith(Store.Bookmarks, undefined).mockReturnValue(Promise.resolve([
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
                }, // as BookmarkSerialized
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
                }, // as BookmarkSerialized
            ]));
            const mockPluginController = mock<PluginController>();
            Object.defineProperty(mockPluginController, 'WebsitePlugins', { get: () => [
                {
                    Identifier: 'website-exists',
                    Title: 'Website (exists)',
                } as IMediaContainer
            ] });
            Object.defineProperty(mockPluginController, 'InfoTrackers', { get: () => [
                {
                    Identifier: 'tracker-exists',
                    Title: 'Tracker (exists)',
                } as IMediaInfoTracker
            ] });

            let updatedEntries: Bookmark[];
            const testee = new BookmarkPlugin(mockStorageController, mockPluginController);
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
            expect(testee.Entries[1].Tracker).toBeUndefined();
            expect(testee.Entries[1].InfoID).toBe('tracker-missing/manga');
        });
    });
});