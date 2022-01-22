import { TestFixture } from '../../../test/WebsitesFixture';

const pluginID = 'hiperdex';
const mangaURL = 'https://hiperdex.com/manga/b-chiku/';
const chapterID = '/ch001';

describe('End-to-End Test: Hiperdex', () => {

    it.skip('Should be registered as website', async () => {
        const fixture = new TestFixture();
        const remotePlugin = await fixture.GetRemoteWebsitePlugin(pluginID);
        expect(await remotePlugin.evaluate(plugin => plugin.Identifier)).toEqual(pluginID);
        expect(await remotePlugin.evaluate(plugin => plugin.Title)).toEqual('Hiperdex');
    });

    it.skip('Should get specific manga', async () => {
        const fixture = new TestFixture();
        const remoteManga = await fixture.GetRemoteContainer(pluginID, mangaURL);
        expect(await remoteManga.evaluate(manga => manga.Identifier)).toEqual('/012.json');
        expect(await remoteManga.evaluate(manga => manga.Title)).toEqual('B-Chiku');
    });

    it.skip('Should get specific chapter', async () => {
        const fixture = new TestFixture();
        const remoteChapter = await fixture.GetRemoteChild(pluginID, mangaURL, chapterID);
        expect(await remoteChapter.evaluate(chapter => chapter.Identifier)).toEqual(chapterID);
        expect(await remoteChapter.evaluate(chapter => chapter.Title)).toEqual('Chapter 1 - Beginning');
    });
});