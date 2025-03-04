import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Same-Site
new TestFixture({
    plugin: {
        id: 'manganato',
        title: 'Manganato'
    },
    container: {
        url: 'https://manganato.com/manga-nh990564',
        id: '/manga-nh990564',
        title: 'Sweet Taboo'
    },
    child: {
        id: 'https://chapmanganato.to/manga-nh990564/chapter-1',
        title: 'Chapter 1: Father-Daughter Standoff'
    },
    entry: {
        index: 0,
        size: 364_983,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// CASE: Cross-Domain
new TestFixture({
    plugin: {
        id: 'manganato',
        title: 'Manganato'
    },
    container: {
        url: 'https://chapmanganato.to/manga-mx989932',
        id: 'https://chapmanganato.to/manga-mx989932',
        title: 'Keep A Low Profile, Sect Leader'
    },
    child: {
        id: 'https://chapmanganato.to/manga-mx989932/chapter-1',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 94_319,
        type: 'image/jpeg'
    }
}).AssertWebsite();