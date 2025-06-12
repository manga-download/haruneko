import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'lectormangalat',
        title: 'LectorManga (.Lat)'
    },
    container: {
        url: 'https://lectormanga.lat/biblioteca/lily-of-the-valley/',
        id: JSON.stringify({ post: '18933', slug: '/biblioteca/lily-of-the-valley/' }),
        title: 'Lily of the valley'
    },
    child: {
        id: '/biblioteca/lily-of-the-valley/capitulo-10/',
        title: 'Capítulo 10'
    },
    entry: {
        index: 0,
        size: 610831,
        type: 'image/jpeg'
    }
}).AssertWebsite();