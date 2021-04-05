import { JSHandle, Page } from 'puppeteer-core';
import { Setup, Teardown } from './PuppeteerFixture';
import { IMediaContainer } from '../src/engine/providers/MediaPlugin';

describe('FetchProvider', () => {

    jest.setTimeout(25000);

    let page: Page;

    beforeAll(async () => {
        page = await Setup();
    });

    afterAll(async () => {
        await Teardown();
    });

    beforeEach(async () => {
        // TODO: cleanup user data directory?
        await page.reload();
        // TODO: wait until HakuNeko engine is loaded ...
        //await page.waitForFunction();
        await page.waitForTimeout(2500);
    });

    describe('SheepMangas', () => {
        it('Should find registered plugin', async () => {
            const remotePlugin = await page.evaluateHandle<JSHandle<IMediaContainer>>((id: string) => {
                return HakuNeko.PluginController.WebsitePlugins.find(connector => connector.Identifier === id);
            }, 'sheepmanga');
            expect(await page.evaluate((plugin: IMediaContainer) => plugin.Title, remotePlugin)).toEqual('Sheep\'s Awesome Mangas');
            /*
            const remoteManga = await page.evaluateHandle<JSHandle<IMediaContainer>>((id: IMediaContainer) => {
                return HakuNeko.PluginController.WebsitePlugins.find(connector => connector.Identifier === id);
            }, 'sheepmanga');
            expect(await page.evaluate((plugin: IMediaContainer) => plugin.Title, remotePlugin)).toEqual('Sheep\'s Awesome Mangas');
            */
        });
    });
});