import { TestFixture } from '../../../test/WebsitesFixture';

describe('End-to-End Test: Toonily', () => {

    it.skip('Should be registered as website', async () => {
        const fixture = new TestFixture();
        const remotePlugin = await fixture.GetRemoteWebsitePlugin('toonily');
        expect(await remotePlugin.evaluate(plugin => plugin.Title)).toEqual('Toonily');
    });
});