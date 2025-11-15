import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Scrambled Images
new TestFixture({
    plugin: {
        id: 'kumotran',
        title: 'KumoTran'
    },
    container: {
        url: 'https://www.kumotran.com/manga/only-realized-after-losing-you/',
        id: JSON.stringify({ post: '199232', slug: '/manga/only-realized-after-losing-you/' }),
        title: 'Only Realized After Losing You'
    },
    child: {
        id: '/manga/only-realized-after-losing-you/48/',
        title: 'ตอนที่ 48'
    },
    entry: {
        index: 0,
        size: 160_823,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// CASE: Plain Images
new TestFixture({
    plugin: {
        id: 'kumotran',
        title: 'KumoTran'
    },
    container: {
        url: 'https://www.kumotran.com/manga/little-hands/',
        id: JSON.stringify({ post: '119579', slug: '/manga/little-hands/' }),
        title: 'Little Hands'
    },
    child: {
        id: '/manga/little-hands/1.1/',
        title: 'ตอนที่ 1.1'
    },
    entry: {
        index: 0,
        size: 290_861,
        type: 'image/jpeg'
    }
}).AssertWebsite();