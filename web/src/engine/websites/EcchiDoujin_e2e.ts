import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ecchidoujin',
        title: 'Ecchi-Doujin'
    },
    container: {
        url: 'https://ecchi-doujin.com/doujin/wireless-onahole/',
        id: '/doujin/wireless-onahole/',
        title: 'Wireless Onahole เสียวไร้สาย'
    },
    child: {
        id: '/wireless-onahole-115/',
        title: 'ตอนที่ 115'
    },
    entry: {
        index: 3,
        size: 284_384,
        type: 'image/webp'
    }
}).AssertWebsite();