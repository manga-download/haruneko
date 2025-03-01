import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Same-subdomain
new TestFixture({
    plugin: {
        id: 'manganelo',
        title: 'Manganelo'
    },
    container: {
        url: 'https://m.manganelo.com/manga-nz101945',
        id: '/manga-nz101945',
        title: 'Tomehane!'
    },
    child: {
        id: 'https://chapmanganelo.com/manga-nz101945/chapter-108',
        title: 'Vol.9 Chapter 108: I Want To Be Appreciated'
    },
    entry: {
        index: 0,
        size: 343_092,
        type: 'image/webp'
    }
}).AssertWebsite();

// CASE: Different subdomain
new TestFixture({
    plugin: {
        id: 'manganelo',
        title: 'Manganelo'
    },
    container: {
        url: 'https://chapmanganelo.com/manga-ag141352',
        id: 'https://chapmanganelo.com/manga-ag141352',
        title: 'The Devil In School'
    },
    child: {
        id: 'https://chapmanganelo.com/manga-ag141352/chapter-21',
        title: 'Chapter 21'
    },
    entry: {
        index: 0,
        size: 348_438,
        type: 'image/jpeg'
    }
}).AssertWebsite();