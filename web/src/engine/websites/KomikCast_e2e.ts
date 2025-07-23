import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'komikcast',
        title: 'KomikCast'
    },
    container: {
        url: 'https://komikcast.li/komik/swordmasters-youngest-son/',
        id: '/komik/swordmasters-youngest-son/',
        title: 'Swordmaster’s Youngest Son'
    },
    child: {
        id: '/chapter/swordmasters-youngest-son-chapter-116-bahasa-indonesia/',
        title: 'Chapter 116'
    },
    entry: {
        index: 1,
        size: 342_909,
        type: 'image/jpeg'
    }
}).AssertWebsite();