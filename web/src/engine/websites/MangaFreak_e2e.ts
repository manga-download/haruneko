import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangafreak',
        title: 'MangaFreak'
    },
    container: {
        url: 'https://ww3.mangafreak.me/Manga/Against_The_Gods',
        id: '/Manga/Against_The_Gods',
        title: 'Against the Gods'
    },
    child: {
        id: '/Read1_Against_The_Gods_1',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 115_089,
        type: 'image/jpeg'
    }
}).AssertWebsite();