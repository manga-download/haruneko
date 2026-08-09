import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'stellarsaber',
        title: 'Stellar Saber'
    },
    container: {
        url: 'https://stellarsaber.pro/manga/jujutsu-kaisen/',
        id: '/manga/jujutsu-kaisen/',
        title: 'Jujutsu Kaisen'
    },
    child: {
        id: encodeURI('/chapter/jujutsu-kaisen-الفصل-249/').toLowerCase(),
        title: 'الفصل 249'
    },
    entry: {
        index: 0,
        size: 610_390,
        type: 'image/webp'
    }
}).AssertWebsite();