import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'lectorjpg',
        title: 'LectorJPG'
    },
    container: {
        url: 'https://lectorjpg.com/serie/killer-beat/',
        id: '/serie/killer-beat/',
        title: 'Killer Beat'
    },
    child: {
        id: '/serie/killer-beat/capitulo-01/',
        title: 'Capítulo 01'
    },
    entry: {
        index: 0,
        size: 931_556,
        type: 'image/webp'
    }
}).AssertWebsite();