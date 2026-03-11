import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'bigcomics',
        title: 'Big Comics'
    },
    container: {
        url: 'https://bigcomics.jp/series/48eef350d364a',
        id: '/series/48eef350d364a',
        title: '岳'
    },
    child: {
        id: '/episodes/4b87f55986ccc/',
        title: '1巻－第0歩 お家'
    },
    entry: {
        index: 0,
        size: 735_822,
        type: 'image/png'
    }
}).AssertWebsite();