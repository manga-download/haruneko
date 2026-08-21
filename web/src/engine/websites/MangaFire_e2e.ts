import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Chapter (English)
new TestFixture({
    plugin: {
        id: 'mangafire',
        title: 'MangaFire'
    },
    container: {
        url: 'https://mangafire.to/title/qnlvj-vagabond22',
        id: 'qnlvj',
        title: 'Vagabond',
        timeout: 10_000
    },
    child: {
        id: 'chapters/7180211',
        title: 'Ch. 25 (Colored Council) (official) (en)'
    },
    entry: {
        index: 2,
        size: 603_549,
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
        url: 'https://mangafire.to/title/qnlvj-vagabond22',
        id: 'qnlvj',
        title: 'Vagabond',
        timeout: 10_000
    },
    child: {
        id: 'chapters/5872243',
        title: 'Ch. 25 吉岡騒然 (unofficial) (ja)'
    },
    entry: {
        index: 2,
        size: 676_379,
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
        url: 'https://mangafire.to/title/qnlvj-vagabond22',
        id: 'qnlvj',
        title: 'Vagabond',
        timeout: 10_000
    },
    child: {
        id: 'volumes/233258',
        title: 'Vol. 10 (en)'
    },
    entry: {
        index: 2,
        size: 566_057,
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
        url: 'https://mangafire.to/title/qnlvj-vagabond22',
        id: 'qnlvj',
        title: 'Vagabond',
        timeout: 10_000
    },
    child: {
        id: 'volumes/152231',
        title: 'Vol. 10 (ja)'
    },
    entry: {
        index: 2,
        size: 797_915,
        type: 'image/jpeg'
    }
}).AssertWebsite();