import { TestFixture } from '../../../test/WebsitesFixture';

// CASE : chapter with manga title
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

// CASE : chapter without manga title
new TestFixture({
    plugin: {
        id: 'toonfr',
        title: 'ToonFR'
    },
    container: {
        url: 'https://toonfr.com/webtoon/frissons/',
        id: JSON.stringify({ post: '458', slug: '/webtoon/frissons/' }),
        title: 'Frissons'
    },
    child: {
        id: '/webtoon/frissons/00/p458-ch-074/',
        title: 'Ep 74 - L\'épouvantail'
    },
    entry: {
        index: 0,
        size: 655_937,
        type: 'image/jpeg'
    }
}).AssertWebsite();
