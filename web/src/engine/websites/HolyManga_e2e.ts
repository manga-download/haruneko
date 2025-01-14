import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'holymanga',
        title: 'Holy Manga'
    },
    container: {
        url: 'https://w34.holymanga.net/manga-grand-metal-organs.html',
        id: '/manga-grand-metal-organs.html',
        title: 'Grand Metal Organs'
    },
    child: {
        id: '/read-grand-metal-organs-chapter-3.1.html',
        title: 'Vol.1 Chapter 3.1'
    },
    entry: {
        index: 0,
        size: 382_318,
        type: 'image/jpeg'
    }
}).AssertWebsite();