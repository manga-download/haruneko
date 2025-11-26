import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mwku',
        title: 'Mwku',
    },
    container: {
        url: 'https://www.mwku.cc/comic/117015',
        id: '/comic/117015',
        title: '彩虹甜甜圈 (台版)'
    },
    child: {
        id: '/comic/117015/1809382',
        title: '第1话'
    },
    entry: {
        index: 0,
        size: 184_768,
        type: 'image/jpeg'
    }
}).AssertWebsite();