import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'visormanga',
        title: 'Visor Manga'
    },
    container: {
        url: 'https://visormanga.com/manga/unbalance-x-3',
        id: '/manga/unbalance-x-3',
        title: 'Unbalance x 3'
    },
    child: {
        id: '/leer/unbalance-x-3-71.00',
        title: 'Capítulo 71.00'
    },
    entry: {
        index: 0,
        size: 87_084,
        type: 'image/webp'
    }
}).AssertWebsite();