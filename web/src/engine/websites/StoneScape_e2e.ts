import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'stonescape',
        title: 'StoneScape'
    },
    container: {
        url: 'https://stonescape.xyz/series/gals-cant-be-kind-to-otaku',
        id: 'gals-cant-be-kind-to-otaku',
        title: `Gals Can't Be Kind to Otaku!?`
    },
    child: {
        id: 'b7bb4ef0-0908-42af-8420-4726fb316ed3',
        title: 'Chapter 14'
    },
    entry: {
        index: 1,
        size: 688_516,
        type: 'image/webp'
    }
}).AssertWebsite();