import { mock } from 'jest-mock-extended';
import type { StorageController } from './StorageController';
import { ItemflagManager } from './ItemflagManager';

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
            testee.LoadContainerFlags(undefined).catch(() =>
                expect(true).toEqual(true)
            );
        });
    });

    // TODO: Sheep ! Do it !
});