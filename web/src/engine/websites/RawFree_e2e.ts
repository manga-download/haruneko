import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'rawfree',
        title: 'Raw FREE'
    },
    container: {
        url: 'https://rawfree.spot/manga-raw/いらないスキル買い取ります-raw-free/',
        id: encodeURI('/manga-raw/いらないスキル買い取ります-raw-free/'),
        title: 'いらないスキル買い取ります'
    },
    child: {
        id: encodeURI('/いらないスキル買い取ります-raw-【第1話】/').toLowerCase(),
        title: '【第1話】'
    },
    entry: {
        index: 1,
        size: 78_204,
        type: 'image/jpeg'
    }
}).AssertWebsite();