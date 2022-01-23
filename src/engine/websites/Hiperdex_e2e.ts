import { TestFixture } from '../../../test/WebsitesFixture';

const pluginID = 'hiperdex';
const mangaURL = 'https://hiperdex.com/manga/b-chiku/';
const chapterID = '/manga/b-chiku/07-end/';

// NOTE: Due to CloudFlare detection of puppeteer (=> infinite loop) some tests need to be skipped right now :(
describe('End-to-End Test: Hiperdex', () => {

    it('Should be registered as website', async () => {
        const fixture = new TestFixture();
        const remotePlugin = await fixture.GetRemoteWebsitePlugin(pluginID);
        expect(await remotePlugin.evaluate(plugin => plugin.Identifier)).toEqual(pluginID);
        expect(await remotePlugin.evaluate(plugin => plugin.Title)).toEqual('Hiperdex');
    });

    it.skip('Should get specific manga', async () => {
        const fixture = new TestFixture();
        const remoteManga = await fixture.GetRemoteContainer(pluginID, mangaURL);
        expect(await remoteManga.evaluate(manga => manga.Identifier)).toEqual('_{"post":"2529","slug":"/manga/b-chiku/"}');
        expect(await remoteManga.evaluate(manga => manga.Title)).toEqual('B-Chiku');
    });

    it.skip('Should get specific chapter', async () => {
        const fixture = new TestFixture();
        const remoteChapter = await fixture.GetRemoteChild(pluginID, mangaURL, chapterID);
        expect(await remoteChapter.evaluate(chapter => chapter.Identifier)).toEqual(chapterID);
        expect(await remoteChapter.evaluate(chapter => chapter.Title)).toEqual('_07 [END]');
    });
});