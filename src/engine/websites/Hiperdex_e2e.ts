import { TestFixture } from '../../../test/WebsitesFixture';

describe('End-to-End Test: Hiperdex', () => {

    it.skip('Should be registered as website', async () => {
        const fixture = new TestFixture();
        const remotePlugin = await fixture.GetRemoteWebsitePlugin('hiperdex');
        expect(await remotePlugin.evaluate(plugin => plugin.Title)).toEqual('Hiperdex');
    });
});