import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'roliascan',
        title: 'Rolia Scan'
    },
    container: {
        url: 'https://roliascan.com/manga/the-bully-in-charge/',
        id: '/manga/the-bully-in-charge/',
        title: 'The Bully In-Charge'
    },
    child: {
        id: '/read/the-bully-in-charge/ch178-80446',
        title: 'Ch. 178 N/A'
    },
    entry: {
        index: 0,
        size: 452_884,
        type: 'image/webp'
    }
}).AssertWebsite();