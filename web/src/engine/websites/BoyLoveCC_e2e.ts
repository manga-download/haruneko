import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Plain Images
new TestFixture({
    plugin: {
        id: 'boylovecc',
        title: 'Boylove.cc'
    },
    container: {
        url: 'https://boylove.cc/home/book/index/id/22104',
        id: '/home/book/index/id/22104',
        title: 'WET SAND/湿沙'
    },
    child: {
        id: '/home/book/capter/id/316973',
        title: '第01话'
    },
    entry: {
        index: 0,
        size: 113_638,
        type: 'image/webp'
    }
}).AssertWebsite();

// CASE: Scrambled Images
new TestFixture({
    plugin: {
        id: 'boylovecc',
        title: 'Boylove.cc'
    },
    container: {
        url: 'https://boylove.cc/home/book/index/id/28671',
        id: '/home/book/index/id/28671',
        title: '不要招惹小狗'
    },
    child: {
        id: '/home/book/capter/id/2185723',
        title: '第1话'
    },
    entry: {
        index: 0,
        size: 1_290_399,
        type: 'image/png'
    }
}).AssertWebsite();