import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'goddoujin',
        title: 'God-Doujin'
    },
    container: {
        url: 'https://god-doujin.com/manga/wireless-onahole/',
        id: '/manga/wireless-onahole/',
        title: 'Wireless Onahole'
    },
    child: {
        id: encodeURI('/wireless-onahole-ตอนที่-106/').toLowerCase(),
        title: 'ตอนที่ 106',
        timeout: 10_000
    },
    entry: {
        index: 0,
        size: 865_034,
        type: 'image/jpeg'
    }
}).AssertWebsite();