import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mainascans',
        title: 'Maina Scans'
    },
    container: {
        url: 'https://mainascans.com/manga/baby-pharmacist-princess',
        id: 'baby-pharmacist-princess',
        title: 'Baby Pharmacist Princess'
    },
    child: {
        id: '/manga/baby-pharmacist-princess/bolum/13',
        title: '13'
    },
    entry: {
        index: 0,
        size: 108_876,
        type: 'image/webp'
    }
}).AssertWebsite();