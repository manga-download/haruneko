import { describe, it, expect } from 'vitest';
import type { JSHandle } from 'puppeteer-core';
import { PuppeteerFixture } from '../../../test/PuppeteerFixture';
import type { PluginController } from './PluginController';
import type { MediaContainer, MediaChild } from './providers/MediaPlugin';

export class TestFixture extends PuppeteerFixture {

    public async GetRemotePluginController(): Promise<JSHandle<PluginController>> {
        return super.Page.evaluateHandle(async () => {
            return window.HakuNeko.PluginController;
        });
    }

    public async GetRemoteWebsitePlugins(): Promise<JSHandle<MediaContainer<MediaChild>[]>> {
        return super.Page.evaluateHandle(async () => {
            return window.HakuNeko.PluginController.WebsitePlugins;
        });
    }
}

describe('PluginController', () => {

    it('Should have embedded WEBP icon for each website', async () => {

        const fixture = await new TestFixture().Connect();
        const remoteTestee = await fixture.GetRemoteWebsitePlugins();

        const actual = await remoteTestee.evaluate(testee => testee.map(website => {
            return {
                website: website.Title,
                signature: website.Icon.slice(0, 23),
                length: (website.Icon.length - 23) * 3/4 // Base64 Data URL => Byte Size
            };
        }));

        for(const icon of actual) {
            try {
                expect(icon.signature).toBe('data:image/webp;base64,');
                expect(icon.length).toBeLessThan(4096);
            } catch(error) {
                console.log(`Invalid icon for website <${icon.website}>:`, icon.signature, ' => ', icon.length, 'bytes');
                throw error;
            }
        }
    });
});