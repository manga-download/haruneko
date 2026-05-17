import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'lunaranimes',
        title: 'Lunar Animes'
    },
    container: {
        url: 'https://lunaranime.ru/manga/the-unorthodox-genius-of-the-house-of-darkness',
        id: 'the-unorthodox-genius-of-the-house-of-darkness',
        title: 'The Unorthodox Genius of the House of Darkness'
    },
    child: {
        id: '/manga/the-unorthodox-genius-of-the-house-of-darkness/43?lang=en',
        title: 'Chapter 43 (en)'
    },
    entry: {
        index: 1,
        size: 658_626,
        type: 'image/jpeg'
    }
}).AssertWebsite();