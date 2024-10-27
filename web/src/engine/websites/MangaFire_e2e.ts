import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangafire',
        title: 'MangaFire'
    },
    container: {
        url: 'https://mangafire.to/manga/vagabond.4mx',
        id: '/manga/vagabond.4mx',
        title: 'Vagabond'
    },
    child: {
        id: JSON.stringify({ itemid: '140775', itemtype: 'volume', language: 'en' }),
        title: 'Vol 38: (en)'
    },
    entry: {
        index: 2,
        size: 156_390,
        type: 'image/jpeg'
    }
}).AssertWebsite();

new TestFixture({
    plugin: {
        id: 'mangafire',
        title: 'MangaFire'
    },
    container: {
        url: 'https://mangafire.to/manga/vagabond.4mx',
        id: '/manga/vagabond.4mx',
        title: 'Vagabond'
    },
    child: {
        id: JSON.stringify({ itemid: '1552876', itemtype: 'chapter', language: 'en' }),
        title: 'Chap 326: To Be A Samurai (en)'
    },
    entry: {
        index: 0,
        size: 353_323,
        type: 'image/jpeg'
    }
}).AssertWebsite();