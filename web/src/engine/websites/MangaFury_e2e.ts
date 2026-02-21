import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangafury',
        title: 'MangaFury'
    },
    container: {
        url: 'https://mangafury.com/manga/reminiscence-adonis/',
        id: JSON.stringify({ post: '2813', slug: '/manga/reminiscence-adonis/' }),
        title: 'Reminiscence Adonis'
    },
    child: {
        id: '/manga/reminiscence-adonis/chapter-286/',
        title: 'Chapter 286'
    },
    entry: {
        index: 0,
        size: 36_656,
        type: 'image/webp'
    }
}).AssertWebsite();