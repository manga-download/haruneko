import { TestFixture } from '../../../test/WebsitesFixture';

describe('End-to-End Test: Leitor', () => {

    it.skip('Should be registered as website', async () => {
        const fixture = new TestFixture();
        const remotePlugin = await fixture.GetRemoteWebsitePlugin('leitor');
        expect(await remotePlugin.evaluate(plugin => plugin.Title)).toEqual('Leitor');
    });
});