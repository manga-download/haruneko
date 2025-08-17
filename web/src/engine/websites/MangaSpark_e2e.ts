import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangaspark',
        title: 'مانجا سبارك (MangaSpark)'
    },
    container: {
        url: 'https://manga-spark.net/manga/baek-xx/',
        id: JSON.stringify({ post: '48423', slug: '/manga/baek-xx/' }),
        title: 'Baek XX'
    },
    child: {
        id: '/manga/baek-xx/96/',
        title: '96'
    },
    entry: {
        index: 0,
        size: 344_656,
        type: 'image/jpeg'
    }
}).AssertWebsite();