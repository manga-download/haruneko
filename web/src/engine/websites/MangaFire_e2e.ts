import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Chapter (English)
new TestFixture({
    plugin: {
        id: 'mangafire',
        title: 'MangaFire'
    },
    container: {
        url: 'https://mangafire.to/manga/vagabondd.4mx',
        id: '4mx',
        title: 'Vagabond'
    },
    child: {
        id: 'chapter/4745876',
        title: 'Chap 25: Chaos at the Yoshioka School (en)'
    },
    entry: {
        index: 0,
        size: 273_603,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// CASE: Chapter (Japanese)
new TestFixture({
    plugin: {
        id: 'mangafire',
        title: 'MangaFire'
    },
    container: {
        url: 'https://mangafire.to/manga/vagabondd.4mx',
        id: '4mx',
        title: 'Vagabond'
    },
    child: {
        id: 'chapter/4723973',
        title: 'Chap 315: 水ぬるむ頃 (ja)'
    },
    entry: {
        index: 0,
        size: 257_114,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// CASE: Volume (English)
new TestFixture({
    plugin: {
        id: 'mangafire',
        title: 'MangaFire'
    },
    container: {
        url: 'https://mangafire.to/manga/vagabondd.4mx',
        id: '4mx',
        title: 'Vagabond'
    },
    child: {
        id: 'volume/122754',
        title: 'Vol 10: (en)'
    },
    entry: {
        index: 0,
        size: 150_104,
        type: 'image/jpeg'
    }
}).AssertWebsite();