import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Chapter with manga title
new TestFixture({
    plugin: {
        id: 'toonfr',
        title: 'ToonFR'
    },
    container: {
        url: 'https://toonfr.com/webtoon/fratrie-foldingue/',
        id: JSON.stringify({ post: '873', slug: '/webtoon/fratrie-foldingue/' }),
        title: 'Fratrie Foldingue'
    },
    child: {
        id: '/webtoon/fratrie-foldingue/00/p873-ch-150/',
        title: 'Ep 150'
    },
    entry: {
        index: 0,
        size: 354_558,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// CASE: Chapter with sub-title
new TestFixture({
    plugin: {
        id: 'toonfr',
        title: 'ToonFR'
    },
    container: {
        url: 'https://toonfr.com/webtoon/double-malefique/',
        id: JSON.stringify({ post: '9384', slug: '/webtoon/double-malefique/' }),
        title: 'Double Maléfique'
    },
    child: {
        id: '/webtoon/double-malefique/00/p9384-ch-005/',
        title: `Ep 5 - Feux d'artifice`
    },
    entry: {
        index: 0,
        size: 394_035,
        type: 'image/jpeg'
    }
}).AssertWebsite();