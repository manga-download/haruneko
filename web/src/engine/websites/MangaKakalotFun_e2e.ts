import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangakakalotfun',
        title: 'MangaKakalotFun',
    },
    container: {
        url: 'https://mangakakalot.fun/manga/enkan-no-lapin',
        id: 'enkan-no-lapin',
        title: 'Enkan No Lapin'
    },
    child: {
        id: '1',
        title: 'Ch.1 - Vol.1 - Chapter 1'
    },
    entry: {
        index: 0,
        size: 26_317,
        type: 'image/jpeg'
    }
}).AssertWebsite();