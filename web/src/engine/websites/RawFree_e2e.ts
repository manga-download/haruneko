import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'rawfree',
        title: 'Raw FREE'
    },
    container: {
        url: 'https://rawfree.luxe/manga-raw/いらないスキル買い取ります-raw-free/',
        id: encodeURI('/manga-raw/いらないスキル買い取ります-raw-free/'),
        title: 'いらないスキル買い取ります'
    },
    child: {
        id: encodeURI('/いらないスキル買い取ります-raw-【第22-3話】/').toLowerCase(),
        title: '【第22-3話】'
    },
    entry: {
        index: 0,
        size: 1_417_528,
        type: 'image/jpeg'
    }
}).AssertWebsite();