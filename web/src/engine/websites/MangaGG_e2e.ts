import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangagg',
        title: 'MangaGG'
    },
    container: {
        url: 'https://mangagg.com/comic/i-built-a-lifespan-club/',
        id: JSON.stringify({ post: '11243', slug: '/comic/i-built-a-lifespan-club/' }),
        title: 'I Built a Lifespan Club'
    },
    child: {
        id: '/comic/i-built-a-lifespan-club/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 357_632,
        type: 'image/jpeg'
    }
}).AssertWebsite();