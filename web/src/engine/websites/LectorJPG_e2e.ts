import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'lectorjpg',
        title: 'LectorJPG'
    },
    container: {
        url: 'https://lectorjpg.com/serie/una-bestia-al-anochcer/',
        id: '/serie/una-bestia-al-anochcer/',
        title: 'Una bestia al anochcer'
    },
    child: {
        id: '/serie/una-bestia-al-anochcer/capitulo-1/',
        title: 'Capítulo 1'
    },
    entry: {
        index: 0,
        size: 1_552_208,
        type: 'image/webp'
    }
}).AssertWebsite();