import { mock } from 'vitest-mock-extended';
import { describe, it, expect, vi } from 'vitest';
import type { ISettings, SettingsManager } from './SettingsManager';
import { type StorageController, Store } from './StorageController';
import { PluginController } from './PluginController';
import { Tags } from './Tags';
import { legacyWebsiteIdentifierMap } from './transformers/BookmarkConverter';

class TestFixture {

    public readonly MockStorageController = mock<StorageController>();
    public readonly MockSettingsManager = mock<SettingsManager>();

    constructor() {
        this.MockSettingsManager.OpenScope.mockReturnValue(mock<ISettings>());
    }

    public CreateTestee() {
        return new PluginController(this.MockStorageController, this.MockSettingsManager);
    }
}

describe('PluginController', () => {

    describe('Constructor', () => {

        it('Should initialize all settings', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();

            const total = [
                testee.WebsitePlugins,
                testee.InfoTrackers
            ].reduce((count, entries) => count + entries.length, 0);

            expect(total).toBeGreaterThan(0);
            expect(fixture.MockSettingsManager.OpenScope).toHaveBeenCalledTimes(total);
        });
    });

    describe('WebsitePlugins', () => {

        it('Should have unique website identifiers', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();

            const actual = testee.WebsitePlugins.map(plugin => plugin.Identifier);
            const expected = [...new Set(actual).values()];

            expect(actual.length).toBeGreaterThan(0);
            expect(actual).toStrictEqual(expected);
        });

        it('Should have unique website titles', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();

            const actual = testee.WebsitePlugins.map(plugin => plugin.Title);
            const expected = [...new Set(actual).values()];

            expect(actual.length).toBeGreaterThan(0);
            expect(actual).toStrictEqual(expected);
        });

        it('Should have a plugin which matches the target identifier for each mapped legacy plugin', () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();
            const expected = [ ...legacyWebsiteIdentifierMap.values() ];

            const missing = expected.filter(id => !testee.WebsitePlugins.some(plugin => plugin.Identifier === id));

            expect(missing).toEqual([]);
        });

        describe.each(new TestFixture().CreateTestee().WebsitePlugins)('$Title', plugin => {

            it('Should have mandatory tags', async () => {
                const expected = {
                    media: Tags.Media.toArray(),
                    source: Tags.Source.toArray(),
                    language: Tags.Language.toArray(),
                };
                const actual = {
                    media: plugin.Tags.Value.filter(tag => expected.media.includes(tag)),
                    source: plugin.Tags.Value.filter(tag => expected.source.includes(tag)),
                    language: plugin.Tags.Value.filter(tag => expected.language.includes(tag)),
                };

                // Skip plugins that are not yet migrated from legacy
                if(plugin.Tags.Value.length > 0) {
                    expect.soft(actual.media).not.toHaveLength(0);
                    //expect.soft(actual.source).not.toHaveLength(0);
                    expect.soft(actual.language).not.toHaveLength(0);
                }
            });

            it('Should have unique tags', async () => {
                const tags = plugin.Tags.Value.map(tag => `${tag.Category}/${tag.Title}`);
                const unique = [ ...new Set(tags).values() ];
                expect(tags).toStrictEqual(unique);
            });
        });
    });

    describe('InfoTrackers', () => {

        it('Should have unique info tracker identifiers', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();

            const actual = testee.InfoTrackers.map(plugin => plugin.Identifier);
            const expected = [...new Set(actual).values()];

            expect(actual.length).toBeGreaterThan(0);
            expect(actual).toStrictEqual(expected);
        });
    });

    describe('Favorites', () => {

        it('Should load favorites from storage on construction', async () => {
            const fixture = new TestFixture();
            const stored = ['plugin-a', 'plugin-b'];
            fixture.MockStorageController.LoadPersistent.calledWith(Store.PluginFavorites).mockResolvedValue(stored);

            const testee = fixture.CreateTestee();
            await vi.waitFor(() => expect(testee.Favorites.Value).toStrictEqual(stored));
        });

        it('Should default to empty array when storage returns non-array', async () => {
            const fixture = new TestFixture();
            fixture.MockStorageController.LoadPersistent.calledWith(Store.PluginFavorites).mockResolvedValue(null);

            const testee = fixture.CreateTestee();
            await vi.waitFor(() => expect(testee.Favorites.Value).toStrictEqual([]));
        });

        it('Should add identifier when toggling a non-favorite', async () => {
            const fixture = new TestFixture();
            fixture.MockStorageController.LoadPersistent.calledWith(Store.PluginFavorites).mockResolvedValue(undefined);
            const testee = fixture.CreateTestee();

            await testee.ToggleFavorite('plugin-a');

            expect(testee.IsFavorite('plugin-a')).toBe(true);
            expect(testee.Favorites.Value).toStrictEqual(['plugin-a']);
        });

        it('Should remove identifier when toggling an existing favorite', async () => {
            const fixture = new TestFixture();
            fixture.MockStorageController.LoadPersistent.calledWith(Store.PluginFavorites).mockResolvedValue(['plugin-a', 'plugin-b']);
            const testee = fixture.CreateTestee();
            await vi.waitFor(() => expect(testee.Favorites.Value).toHaveLength(2));

            await testee.ToggleFavorite('plugin-a');

            expect(testee.IsFavorite('plugin-a')).toBe(false);
            expect(testee.Favorites.Value).toStrictEqual(['plugin-b']);
        });

        it('Should persist favorites to storage after toggle', async () => {
            const fixture = new TestFixture();
            fixture.MockStorageController.LoadPersistent.calledWith(Store.PluginFavorites).mockResolvedValue(undefined);
            const testee = fixture.CreateTestee();

            await testee.ToggleFavorite('plugin-a');

            expect(fixture.MockStorageController.SavePersistent).toHaveBeenCalledWith(['plugin-a'], Store.PluginFavorites);
        });

        it('Should report correct favorite status via IsFavorite', async () => {
            const fixture = new TestFixture();
            fixture.MockStorageController.LoadPersistent.calledWith(Store.PluginFavorites).mockResolvedValue(['plugin-a']);
            const testee = fixture.CreateTestee();
            await vi.waitFor(() => expect(testee.Favorites.Value).toHaveLength(1));

            expect(testee.IsFavorite('plugin-a')).toBe(true);
            expect(testee.IsFavorite('plugin-b')).toBe(false);
        });
    });
});