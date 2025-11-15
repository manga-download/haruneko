import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'covenscan',
        title: 'CovenScan'
    },
    container: {
        url: 'https://covendasbruxonas.com/manga/still-it-rains/',
        id: JSON.stringify({ post: '1015', slug: '/manga/still-it-rains/' }),
        title: 'Still, It Rains'
    },
    child: {
        id: '/manga/still-it-rains/capitulo-01/',
        title: 'Capítulo 01'
    },
    entry: {
        index: 7,
        size: 802_942,
        type: 'image/jpeg'
    }
}).AssertWebsite();