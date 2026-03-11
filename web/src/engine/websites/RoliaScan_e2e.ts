import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'roliascan',
        title: 'Rolia Scan'
    },
    container: {
        url: 'https://roliascan.com/manga/designated-bully/',
        id: '/manga/designated-bully/',
        title: 'Designated Bully'
    },
    child: {
        id: '/manga/designated-bully/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 13,
        size: 428_532,
        type: 'image/webp'
    }
}).AssertWebsite();