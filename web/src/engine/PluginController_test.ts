import { mock } from 'vitest-mock-extended';
import { describe, it, expect } from 'vitest';
import * as dns from 'node:dns/promises';
import type { ISettings, SettingsManager } from './SettingsManager';
import type { StorageController } from './StorageController';
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

        it('Should not have any plugin which matches the source identifier of a mapped legacy plugin', () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();

            const legacyIdentifiers = [ ...legacyWebsiteIdentifierMap.keys() ].filter(id => testee.WebsitePlugins.some(plugin => plugin.Identifier === id));

            expect(legacyIdentifiers).toBe([]);
        });

        it('Should have a plugin which matches the target identifier for each mapped legacy plugin', () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();
            const expected = [ ...legacyWebsiteIdentifierMap.values() ];

            const legacyIdentifiers = expected.filter(id => testee.WebsitePlugins.some(plugin => plugin.Identifier === id));

            expect(legacyIdentifiers).toEqual(expected);
        });

        /*
        it('Should have valid URIs', {  }, async () => {
            const fixture = new TestFixture();
            const testee = fixture.CreateTestee();

            const rejected = (await Promise.allSettled(testee.WebsitePlugins.map(async plugin => {
                try {
                    if(!/^http/.test(plugin.URI.origin)) {
                        throw new Error(`Invalid URI ➔ ${plugin.URI.href}`);
                    }
                    const ip4 = await dns.lookup(plugin.URI.hostname);
                    const bytes = ip4.address.split('.').map(s => parseInt(s, 10));
                    if(bytes.some(n => isNaN(n) || n < 1 || n > 255)) {
                        throw new Error(`Invalid IP ➔ ${ip4.address}`);
                    }
                    //const response = await fetch(plugin.URI);
                    //expect(response.url).toBe(plugin.URI.href);
                } catch(error) {
                    throw new Error(`${plugin.Title} <${plugin.Identifier}> ${error}`);
                }
            }))).filter(result => result.status === 'rejected').map(result => result.reason);

            expect(rejected).toBe([]);
        });
        */

        describe.each(new TestFixture().CreateTestee().WebsitePlugins)('$Title', { concurrent: true }, (plugin) => {

            it('Should have valid URIs', { timeout: 5000 }, async () => {
                expect(plugin.URI.origin).toMatch(/^http/);
                const ip = await dns.lookup(plugin.URI.hostname);
                expect(ip.address).toSatisfy((ip4: string) => {
                    const bytes = ip4.split('.').map(s => parseInt(s, 10));
                    return bytes.at(0) > 0 && !bytes.some(n => isNaN(n) || n < 0 || n > 255);
                });
                //const response = await fetch(plugin.URI);
                //expect(response.url).toBe(plugin.URI.href);
            });

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
});