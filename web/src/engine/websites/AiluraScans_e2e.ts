import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ailurascans',
        title: 'Ailura Scans'
    },
    container: {
        url: 'https://ailurascans.com/seri/hayranligini-gizleyen-prenses',
        id: 'hayranligini-gizleyen-prenses',
        title: 'Hayranlığını Gizleyen Prenses'
    },
    child: {
        id: '69e24610456420b515c5ef71',
        title: 'bölüm 98'
    },
    entry: {
        index: 1,
        size: 1_792_864,
        type: 'image/webp'
    }
}).AssertWebsite();