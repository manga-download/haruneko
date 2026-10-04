import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'creativecomic',
        title: 'Creative Comic'
    },
    container: {
        url: 'https://www.creative-comic.tw/zh/book/376/content',
        id: '376',
        title: '沒有那麼甜'
    },
    child: {
        id: '7009',
        title: '特別篇'
    },
    entry: {
        index: 0,
        size: 177_308,
        type: 'image/jpeg'
    }
}).AssertWebsite();