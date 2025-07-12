import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'aethrascans',
        title: 'Aethra Scans',
    },
    container: {
        url: 'https://aethrascans.com/manga/iblis-akademisinin-tilki-gozlu-tirani/',
        id: '/manga/iblis-akademisinin-tilki-gozlu-tirani/',
        title: 'İblis Akademisinin Tilki Gözlü Tiranı'
    },
    child: {
        id: '/iblis-akademisinin-tilki-gozlu-tirani-bolum-1/',
        title: 'Bölüm 1 -'
    },
    entry: {
        index: 0,
        size: 759_197,
        type: 'image/jpeg'
    }
}).AssertWebsite();