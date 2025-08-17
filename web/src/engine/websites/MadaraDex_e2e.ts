import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'madaradex',
        title: 'MadaraDex'
    },
    container: {
        url: 'https://madaradex.org/title/eleceed/',
        id: JSON.stringify({ post: '513', slug: '/title/eleceed/' }),
        title: 'Eleceed'
    },
    child: {
        id: '/title/eleceed/chapter-350/',
        title: 'Chapter 350'
    },
    entry: {
        index: 0,
        size: 508_874,
        type: 'image/webp'
    }
}).AssertWebsite();