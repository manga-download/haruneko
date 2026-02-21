import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Continuous Images
new TestFixture({
    plugin: {
        id: 'madaradex',
        title: 'MadaraDex',
    },
    container: {
        url: 'https://madaradex.org/title/eleceed/',
        id: JSON.stringify({ post: '513', slug: '/title/eleceed/' }),
        title: 'Eleceed',
    },
    child: {
        id: '/title/eleceed/chapter-350/',
        title: 'Chapter 350',
    },
    entry: {
        index: 0,
        size: 508_874,
        type: 'image/webp',
    },
}).AssertWebsite();

// CASE: Paginated Images
new TestFixture({
    plugin: {
        id: 'madaradex',
        title: 'MadaraDex',
    },
    container: {
        url: 'https://madaradex.org/title/parallel-paradise/',
        id: JSON.stringify({ post: '533', slug: '/title/parallel-paradise/' }),
        title: 'Parallel Paradise',
    },
    child: {
        id: '/title/parallel-paradise/chapter-250/',
        title: 'Chapter 250',
    },
    entry: {
        index: 4,
        size: 530_758,
        type: 'image/webp',
    },
}).AssertWebsite();

// TODO: CASE - Images via Proxy