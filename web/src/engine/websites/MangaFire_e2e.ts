import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Chapter (English)
new TestFixture({
    plugin: {
        id: 'mangafire',
        title: 'MangaFire'
    },
    container: {
        url: 'https://mangafire.to/title/pvzy-vagabondd',
        id: 'pvzy',
        title: 'Vagabond',
        timeout: 10_000
    },
    child: {
        id: '7536601',
        title: 'Ch. 25 Chaos at the Yoshioka School (official) (en)'
    },
    entry: {
        index: 2,
        size: 863_103,
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
        url: 'https://mangafire.to/title/pvzy-vagabondd',
        id: 'pvzy',
        title: 'Vagabond',
        timeout: 10_000
    },
    child: {
        id: '4724613',
        title: 'Ch. 25 吉岡騒然 (unofficial) (ja)'
    },
    entry: {
        index: 0,
        size: 289_836,
        type: 'image/jpeg'
    }
}).AssertWebsite();