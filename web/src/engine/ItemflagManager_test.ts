import { vi, describe, it, expect } from 'vitest';
import type { StorageController } from './StorageController';
import { ItemflagManager } from './ItemflagManager';
import type { MediaContainer, MediaChild } from './providers/MediaPlugin';

class TestFixture {

    public readonly MockStorageController = { LoadPersistent: vi.fn() };

    public CreateTestee() {
        return new ItemflagManager(this.MockStorageController as unknown as StorageController);
    }
}

describe('ItemflagManager', () => {

    describe('Constructor', () => {

        it('Should load on demand', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();
            testee.LoadContainerFlags({ Identifier: 'Title', Parent: { Identifier: 'Website' } } as MediaContainer<MediaChild>);
            expect(fixture.MockStorageController.LoadPersistent).toHaveBeenCalledWith('Itemflags', 'Website :: Title');
            // TODO: complete assertions ...
        });

        it('Should skip bookmarked media for which the website was removed (no parent)', () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();
            testee.LoadContainerFlags({ Identifier: '-', Parent: undefined } as MediaContainer<MediaChild>);
            expect(fixture.MockStorageController.LoadPersistent).toHaveBeenCalledTimes(0);
        });
    });

    // TODO: Sheep ! Do it !
});