import { mock } from 'jest-mock-extended';
import type { ISettings, SettingsManager } from './SettingsManager';
import type { StorageController } from './StorageController';
//import { PluginController } from './PluginController';
import type { MediaChild, MediaContainer } from './providers/MediaPlugin';
import { Tags } from './Tags';

class TestFixture {

    public readonly MockStorageController = mock<StorageController>();
    public readonly MockSettingsManager = mock<SettingsManager>();

    constructor() {
        this.MockSettingsManager.OpenScope.mockReturnValue(mock<ISettings>());
    }

    public CreateTestee() {
        // TODO: Fix '*.proto' file import in typescript and re-enable test
        return null;
        //return new PluginController(this.MockStorageController, this.MockSettingsManager);
    }
}

describe('PluginController', () => {

    describe('Constructor', () => {

        // TODO: Fix '*.proto' file import in typescript and re-enable test
        it.skip('Should initialize all settings', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();

            const total = [
                testee.WebsitePlugins,
                testee.InfoTrackers
            ].reduce((count, entries) => count + entries.length, 0);

            expect(total).toBeGreaterThan(0);
            expect(fixture.MockSettingsManager.OpenScope).toBeCalledTimes(total);
        });
    });

    describe('WebsitePlugins', () => {

        // TODO: Fix '*.proto' file import in typescript and re-enable test
        it.skip('Should have unique website identifiers', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();

            const actual = testee.WebsitePlugins.map(plugin => plugin.Identifier);
            const expected = [...new Set(actual).values()];

            expect(actual.length).toBeGreaterThan(0);
            expect(actual).toStrictEqual(expected);
        });

        // TODO: Fix '*.proto' file import in typescript and re-enable test
        it.skip('Should have unique website titles', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();

            const actual = testee.WebsitePlugins.map(plugin => plugin.Title);
            const expected = [...new Set(actual).values()];

            expect(actual.length).toBeGreaterThan(0);
            expect(actual).toStrictEqual(expected);
        });

        it.skip('Should have mandatory tags', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();

            function missingMandatoryTags(plugin: MediaContainer<MediaContainer<MediaChild>>): boolean {
                return plugin.Tags.length < 3
                    || !plugin.Tags.some(tag => Tags.Media.toArray().includes(tag))
                    || !plugin.Tags.some(tag => Tags.Source.toArray().includes(tag))
                    || !plugin.Tags.some(tag => Tags.Language.toArray().includes(tag));
            }

            const pluginsMissingTags = testee.WebsitePlugins.filter(missingMandatoryTags).map(plugin => plugin.Title);
            if (pluginsMissingTags.length > 0) {
                console.log(pluginsMissingTags);
            }
            expect(pluginsMissingTags.length).toBe(0);
        });
    });

    describe('InfoTrackers', () => {

        // TODO: Fix '*.proto' file import in typescript and re-enable test
        it.skip('Should have unique info tracker identifiers', async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();

            const actual = testee.InfoTrackers.map(plugin => plugin.Identifier);
            const expected = [...new Set(actual).values()];

            expect(actual.length).toBeGreaterThan(0);
            expect(actual).toStrictEqual(expected);
        });
    });
});