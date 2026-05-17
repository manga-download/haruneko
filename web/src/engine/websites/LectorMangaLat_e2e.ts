import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'lectormangalat',
        title: 'LectorManga (.Lat)'
    },
    container: {
        url: 'https://lectormangass.com/biblioteca/sin-dormir/',
        id: JSON.stringify({ post: '20742', slug: '/biblioteca/sin-dormir/' }),
        title: 'Sin dormir'
    },
    child: {
        id: '/biblioteca/sin-dormir/capitulo-72/',
        title: 'Capítulo 72'
    },
    entry: {
        index: 2,
        size: 287_900,
        type: 'image/webp'
    }
}).AssertWebsite();