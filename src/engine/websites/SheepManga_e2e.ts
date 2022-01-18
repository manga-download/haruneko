import { TestFixture } from '../../../test/WebsitesFixture';

describe('End-to-End Test: SheepManga', () => {

    it('Should be registered as website', async () => {
        const fixture = new TestFixture();
        const remotePlugin = await fixture.GetRemoteWebsitePlugin('sheep-scanlations');
        expect(await remotePlugin.evaluate(plugin => plugin.Title)).toEqual(`Sheep's Awesome Mangas`);
    });

    it('Should get specific manga', async () => {
        const fixture = new TestFixture();
        const remoteManga = await fixture.GetRemoteContainer('sheep-scanlations', '/012.json');
        expect(await remoteManga.evaluate(manga => manga.Title)).toEqual('Real ➉');
    });

    it('Should get specific chapter', async () => {
        const fixture = new TestFixture();
        const remoteChapter = await fixture.GetRemoteChild('sheep-scanlations', '/012.json', '/ch001');
        expect(await remoteChapter.evaluate(chapter => chapter.Title)).toEqual('Chapter 1 - Beginning');
    });
});