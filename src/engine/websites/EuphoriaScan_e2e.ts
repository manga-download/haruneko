import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'euphoriascan',
        title: 'Euphoria Scan'
    },
    container: {
        url: 'https://euphoriascan.com/manga/two-souls/',
        id: JSON.stringify({ post: '370', slug: '/manga/two-souls/' }),
        title: 'Two Souls'
    },
    child: {
        id: '/manga/two-souls/capitulo-61/',
        title: 'Capítulo 61'
    },
    entry: {
        index: 0,
        size: 146_039,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();