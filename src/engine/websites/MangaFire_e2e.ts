import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Chapter (English)
new TestFixture({
    plugin: {
        id: 'mangafire',
        title: 'MangaFire'
    },
    container: {
        url: 'https://mangafire.to/manga/vagabondd.4mx',
        id: '/manga/vagabondd.4mx',
        title: 'Vagabond'
    },
    child: {
        id: '/read/vagabondd.4mx/en/chapter-25',
        title: 'Chapter 25: Chaos at the Yoshioka School (en)'
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
        id: '/manga/vagabondd.4mx',
        title: 'Vagabond'
    },
    child: {
        id: '/read/vagabondd.4mx/ja/chapter-25',
        title: 'Chapter 25: 吉岡騒然 (ja)'
    },
    entry: {
        index: 0,
        size: 289_836,
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
        id: '/manga/vagabondd.4mx',
        title: 'Vagabond'
    },
    child: {
        id: '/read/vagabondd.4mx/en/volume-10',
        title: 'Vol 10 (en)'
    },
    entry: {
        index: 0,
        size: 150_104,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// CASE: Volume (Japanese)
new TestFixture({
    plugin: {
        id: 'mangafire',
        title: 'MangaFire'
    },
    container: {
        url: 'https://mangafire.to/manga/vagabondd.4mx',
        id: '/manga/vagabondd.4mx',
        title: 'Vagabond'
    },
    child: {
        id: '/read/vagabondd.4mx/ja/volume-10',
        title: 'Vol 10 (ja)'
    },
    entry: {
        index: 0,
        size: 242_294,
        type: 'image/jpeg'
    }
}).AssertWebsite();