import type { JSHandle, Page } from 'puppeteer-core';
import type { PluginController } from './PluginController';
import type { IMediaContainer } from './providers/MediaPlugin';

export class TestFixture {

    private readonly page: Page;

    constructor() {
        this.page = global.PAGE as Page;
    }

    public async GetRemotePluginController(): Promise<JSHandle<PluginController>> {
        return this.page.evaluateHandle(async () => {
            return window.HakuNeko.PluginController;
        });
    }

    public async GetRemoteWebsitePlugins(): Promise<JSHandle<IMediaContainer[]>> {
        return this.page.evaluateHandle(async () => {
            return window.HakuNeko.PluginController.WebsitePlugins;
        });
    }
}

describe('PluginController', () => {

    it('Should have embedded WEBP icon for each website', async () => {

        const fixture = new TestFixture();
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