import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangaplaza',
        title: 'MangaPlaza'
    },
    container: {
        url: 'https://mangaplaza.com/title/0303001706/',
        id: '/title/0303001706/',
        title: 'Defying Kurosaki-kun'
    },
    child: {
        id: '/reader/103030017060001/?return_url=https%3A%2F%2Fmangaplaza.com%2Ftitle%2F0303001706%2F%3Forder%3Ddown%26content_id%3D103030017060001',
        title: '#1',
        timeout: 10000
    },
    entry: {
        index: 3,
        size: 2_096_114,
        type: 'image/png'
    }
}).AssertWebsite();