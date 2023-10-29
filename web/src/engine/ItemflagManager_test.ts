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

        it('Should not load flag when creating instance', () => {
            const fixture = new TestFixture();
            fixture.CreateTestee();
            expect(fixture.MockStorageController.LoadPersistent).toBeCalledTimes(0);
        });
    });

    // TODO: Sheep ! Do it !
});