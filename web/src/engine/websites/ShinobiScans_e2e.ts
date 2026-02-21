import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'shinobiscans',
        title: 'ShinobiScans'
    },
    container: {
        url: 'https://shinobiscans.com/manga/martial-god-asura/',
        id: JSON.stringify({ post: '1333', slug: '/manga/martial-god-asura/' }),
        title: 'Martial God Asura'
    },
    child: {
        id: '/manga/martial-god-asura/volume-1/1/',
        title: '1 - Il discepolo esterno'
    },
    entry: {
        index: 1,
        size: 299_678,
        type: 'image/jpeg'
    }
}).AssertWebsite();