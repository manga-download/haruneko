import { JSHandle, Page } from 'puppeteer-core';
import { Reload } from '../../../test/PuppeteerFixture';
import { IMediaContainer } from '../providers/MediaPlugin';

export default (): void => {

    let page: Page;

    beforeEach(async () => {
        page = await Reload();
        await page.waitForSelector('body div#app * * *');
    });

    it('Should find registered plugin', async () => {

        const remotePlugin = await page.evaluateHandle<JSHandle<IMediaContainer>>((id: string) => {
            return window.HakuNeko.PluginController.WebsitePlugins.find(connector => connector.Identifier === id);
        }, 'toonily');
        expect(await page.evaluate((plugin: IMediaContainer) => plugin.Title, remotePlugin)).toEqual('Toonily');
    });
};