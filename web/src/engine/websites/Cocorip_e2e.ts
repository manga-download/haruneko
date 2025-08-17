import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'cocorip',
        title: 'Cocorip'
    },
    container: {
        url: 'https://cocorip.net/manga/assassin/',
        id: JSON.stringify({ post: '9919', slug: '/manga/assassin/' }),
        title: 'Assassin'
    },
    child: {
        id: '/manga/assassin/capitulo-1/',
        title: 'Capítulo 1'
    },
    entry: {
        index: 1,
        size: 226_668,
        type: 'image/webp'
    }
}).AssertWebsite();