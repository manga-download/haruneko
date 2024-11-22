import { describe, it, expect } from 'vitest';
import type { JSHandle } from 'puppeteer-core';
import { PuppeteerFixture } from '../../../test/PuppeteerFixture';
import type { MediaContainer, MediaChild } from './providers/MediaPlugin';
import type { PluginController } from './PluginController';

export class RemoteFixture extends PuppeteerFixture {

    public async GetRemotePluginController(): Promise<JSHandle<PluginController>> {
        return this.EvaluateHandle(async () => {
            return window.HakuNeko.PluginController;
        });
    }

    public async GetRemoteWebsitePlugins(): Promise<JSHandle<ReadonlyArray<MediaContainer<MediaContainer<MediaChild>>>>> {
        return this.EvaluateHandle(async () => {
            return window.HakuNeko.PluginController.WebsitePlugins;
        });
    }
}

describe('PluginController', { concurrent: true }, () => {

    describe('Website Icons', async () => {

        const fixture = new RemoteFixture();
        const plugins = await fixture.GetRemoteWebsitePlugins();
        const icons = await plugins.evaluate(testee => testee.map(website => {
            return {
                website: website.Title,
                signature: website.Icon.slice(0, 23),
                length: (website.Icon.length - 23) * 3/4 // Base64 Data URL => Byte Size
            };
        }));

        it.each(icons)('Should have an embedded WEBP icon for $website', async (icon) => {
            expect(icon.signature).toBe('data:image/webp;base64,');
            expect(icon.length).toBeLessThan(4096);
        });
    });
});