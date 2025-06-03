import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'madaradex',
        title: 'MadaraDex'
    },
    container: {
        url: 'https://madaradex.org/title/eleceed/',
        id: JSON.stringify({ post: '942', slug: '/title/eleceed/' }),
        title: 'Eleceed'
    },
    child: {
        id: '/title/eleceed/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 12_212,
        type: 'image/webp'
    }
}).AssertWebsite();