import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ikanmh',
        title: 'Ikanmh'
    },
    container: {
        url: 'https://ikanmh.cc/book/610',
        id: '/book/610',
        title: '浪漫露營'
    },
    child: {
        id: '/chapter/25657',
        title: '第1話-正值交配季節的露營場',
    },
    entry: {
        index: 0,
        size: 234_906,
        type: 'image/jpeg'
    }
}).AssertWebsite();