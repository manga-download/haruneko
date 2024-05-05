import { mock } from 'vitest-mock-extended';
import { describe, it, expect } from 'vitest';
import type { StorageController } from './StorageController';
import { ItemflagManager } from './ItemflagManager';
import type { MediaContainer, MediaChild } from './providers/MediaPlugin';

class TestFixture {

    public readonly MockStorageController = mock<StorageController>();

    public CreateTestee() {
        return new ItemflagManager(this.MockStorageController);
    }
}

describe('ItemflagManager', () => {

    describe('Constructor', () => {

        it('Should load on demand', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();
            testee.LoadContainerFlags(mock<MediaContainer<MediaChild>>({ Identifier: 'Title', Parent: { Identifier: 'Website' } }));
            expect(fixture.MockStorageController.LoadPersistent).toBeCalledWith('Itemflags', 'Website :: Title');
            // TODO: complete assertions ...
        });

        it('Should skip bookmarked media for which the website was removed (no parent)', () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();
            testee.LoadContainerFlags(mock<MediaContainer<MediaChild>>({ Identifier: '-', Parent: undefined }));
            expect(fixture.MockStorageController.LoadPersistent).toBeCalledTimes(0);
        });
    });

    // TODO: Sheep ! Do it !
});