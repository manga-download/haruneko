import { TestFixture } from '../../../test/WebsitesFixture';

const pluginID = 'sheep-scanlations';
const mangaURL = 'https://hakuneko.download/sample-websites/sheep-scanlations/012.json';
const chapterID = '/ch001';

describe('End-to-End Test: SheepManga', () => {

    it('Should be registered as website', async () => {
        const fixture = new TestFixture();
        const remotePlugin = await fixture.GetRemoteWebsitePlugin(pluginID);
        expect(await remotePlugin.evaluate(plugin => plugin.Identifier)).toEqual(pluginID);
        expect(await remotePlugin.evaluate(plugin => plugin.Title)).toEqual(`Sheep's Awesome Mangas`);
    });

    it('Should get specific manga', async () => {
        const fixture = new TestFixture();
        const remoteManga = await fixture.GetRemoteContainer(pluginID, mangaURL);
        expect(await remoteManga.evaluate(manga => manga.Identifier)).toEqual('/012.json');
        expect(await remoteManga.evaluate(manga => manga.Title)).toEqual('Real ➉');
    });

    it('Should get specific chapter', async () => {
        const fixture = new TestFixture();
        const remoteChapter = await fixture.GetRemoteChild(pluginID, mangaURL, chapterID);
        expect(await remoteChapter.evaluate(chapter => chapter.Identifier)).toEqual(chapterID);
        expect(await remoteChapter.evaluate(chapter => chapter.Title)).toEqual('Chapter 1 - Beginning');
    });
});