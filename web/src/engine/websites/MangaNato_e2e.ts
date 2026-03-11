import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manganato',
        title: 'Manganato'
    },
    container: {
        url: 'https://www.manganato.gg/manga/sweet-taboo',
        id: '/manga/sweet-taboo',
        title: 'Sweet Taboo'
    },
    child: {
        id: '/manga/sweet-taboo/chapter-1',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 100_014,
        type: 'image/webp'
    }
}).AssertWebsite();