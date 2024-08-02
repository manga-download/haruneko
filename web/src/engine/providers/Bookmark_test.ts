import { mock } from 'vitest-mock-extended';
import { describe, it, expect } from 'vitest';
import type { MediaContainer, MediaChild } from './MediaPlugin';
import type { MediaInfoTracker } from '../trackers/IMediaInfoTracker';
import { Bookmark } from './Bookmark';

class TestFixture {

    public readonly CreationTime = 123456;
    public readonly ModificationTime = 654321;
    public readonly OriginIdentifier = 'sheepyneko';
    public readonly OriginTitle = 'Sheepy Neko';
    public readonly MockParent = mock<MediaContainer<MediaContainer<MediaChild>>>();
    public readonly MockOrigin: MediaContainer<MediaChild>;
    public readonly MockInfoTracker = mock<MediaInfoTracker>();
    public readonly InfoIdentifier = 'sheepyneko@info-tracker';

    public CreateSparseTestee() {
        return new Bookmark(new Date(this.CreationTime), new Date(this.ModificationTime), this.MockParent, this.OriginIdentifier, this.OriginTitle);
    }

    public CreateTestee() {
        return new Bookmark(new Date(this.CreationTime), new Date(this.ModificationTime), this.MockParent, this.OriginIdentifier, this.OriginTitle, this.MockInfoTracker, this.InfoIdentifier);
    }
}

describe('Bookmark', () => {

    describe('Constructor', () => {

        it('Should correctly assign mandatory parameters', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateSparseTestee();

            expect(testee.Created.getTime()).toBe(fixture.CreationTime);
            expect(testee.Updated.Value.getTime()).toBe(fixture.ModificationTime);
            expect(testee.Identifier).toBe(fixture.OriginIdentifier);
            expect(testee.Title).toBe(fixture.OriginTitle);
            expect(testee.Parent).toBe(fixture.MockParent);
            expect(testee.Tracker).toBeNull();
            expect(testee.InfoID).toBeNull();
        });

        it('Should correctly assign optional parameters', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();

            expect(testee.Created.getTime()).toBe(fixture.CreationTime);
            expect(testee.Updated.Value.getTime()).toBe(fixture.ModificationTime);
            expect(testee.Identifier).toBe(fixture.OriginIdentifier);
            expect(testee.Title).toBe(fixture.OriginTitle);
            expect(testee.Parent).toBe(fixture.MockParent);
            expect(testee.Tracker).toBe(fixture.MockInfoTracker);
            expect(testee.InfoID).toBe(fixture.InfoIdentifier);
        });
    });

    describe('Entries', () => {

        it('Should find existing origin in parent and pass-through entries from origin', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateSparseTestee();

            const entries = mock<MediaContainer<MediaChild>[]>();
            const origin = mock<MediaContainer<MediaChild>>();
            Object.defineProperty(origin, 'Identifier', { get: () => testee.Identifier });
            Object.defineProperty(origin, 'Entries', { get: () => { return { Value: entries }; } });

            const children = [ origin ];
            Object.defineProperty(fixture.MockParent, 'Entries', { get: () => { return { Value: children }; } });

            const actual = testee.Entries.Value;

            expect(actual).toBe(entries);
            expect(children[0]).toBe(origin);
            expect(fixture.MockParent.Entries.Value[0]).toBe(origin);
            expect(fixture.MockParent.CreateEntry).toHaveBeenCalledTimes(0);
        });

        it('Should create non-existing origin once and pass-through the same instance', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateSparseTestee();

            const entries = mock<MediaContainer<MediaChild>[]>();
            const origin = mock<MediaContainer<MediaChild>>();
            Object.defineProperty(origin, 'Identifier', { get: () => testee.Identifier });
            Object.defineProperty(origin, 'Entries', { get: () => { return { Value: entries }; } });

            const children = [];
            fixture.MockParent.CreateEntry.calledWith(testee.Identifier, testee.Title).mockReturnValue(origin);
            Object.defineProperty(fixture.MockParent, 'Entries', { get: () => { return { Value: children }; } });

            // Multiple calls to internal `Origin` getter to verify that `CreateEntry` is only called once
            const actual = testee.Entries.Value && testee.Entries.Value && testee.Entries.Value;

            expect(actual).toBe(entries);
            expect(children.length).toBe(0);
            expect(fixture.MockParent.Entries.Value.length).toBe(0);
            expect(fixture.MockParent.CreateEntry).toHaveBeenCalledTimes(1);
            expect(fixture.MockParent.CreateEntry).toHaveBeenCalledWith(testee.Identifier, testee.Title);
        });
    });
});