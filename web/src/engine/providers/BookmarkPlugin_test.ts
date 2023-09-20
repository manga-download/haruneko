import { mock } from 'jest-mock-extended';
import type { IMediaChild, IMediaContainer } from './MediaPlugin';
import { Bookmark } from './BookmarkPlugin';
import type { IMediaInfoTracker } from '../trackers/IMediaInfoTracker';

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