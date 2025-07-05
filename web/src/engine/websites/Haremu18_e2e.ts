import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'haremu18',
        title: 'Haremu18'
    },
    container: {
        url: 'https://haremu18.net/manga/te-shu-bodeigado',
        id: '/manga/te-shu-bodeigado',
        title: '特殊ボディガード'
    },
    child: {
        id: '/manga/te-shu-bodeigado/chapter-9',
        title: '第9話'
    },
    entry: {
        index: 0,
        size: 6_026,
        type: 'image/webp'
    }
}).AssertWebsite();