import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'komikcast',
        title: 'KomikCast'
    },
    container: {
        url: 'https://v3.komikcast.fit/series/swordmasters-youngest-son',
        id: 'swordmasters-youngest-son',
        title: 'Swordmaster’s Youngest Son'
    },
    child: {
        id: '197',
        title: 'Chapter 197'
    },
    entry: {
        index: 1,
        size: 267_484,
        type: 'image/jpeg'
    }
}).AssertWebsite();