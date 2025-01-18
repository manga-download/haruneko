import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'igniscomic',
        title: 'Ignis Comic'
    },
    container: {
        url: 'https://igniscomic.com/manga/demon-god-of-apocalyptic-behemoth/',
        id: '/manga/demon-god-of-apocalyptic-behemoth/',
        title: 'Demon God of Apocalyptic Behemoth'
    },
    child: {
        id: '/demon-god-of-apocalyptic-behemoth-chapter-14/',
        title: 'Chapter 14'
    },
    entry: {
        index: 0,
        size: 975_938,
        type: 'image/webp'
    }
}).AssertWebsite();