import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'goodtoon',
        title: 'GoodToon'
    },
    container: {
        url: 'https://www.goodtoon011.com/manga/gt-13985/',
        id: JSON.stringify({ post: '13985', slug: '/manga/gt-13985/' }),
        title: '선무제존'
    },
    child: {
        id: '/manga/gt-13985/660/',
        title: '660화'
    },
    entry: {
        index: 0,
        size: 72_377,
        type: 'image/jpeg'
    }
}).AssertWebsite();