import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'animexnovel',
        title: 'Anime X Novel',
    },
    container: {
        url: 'https://www.animexnovel.com/manhua/as-100-maldicoes-da-casa-illeston/',
        id: '/manhua/as-100-maldicoes-da-casa-illeston/',
        title: 'As 100 Maldições da Casa Illeston'
    },
    child: {
        id: '/manhua/as-100-maldicoes-da-casa-illeston/capitulo-1/',
        title: ' – Capítulo 1'
    },
    entry: {
        index: 7,
        size: 962_192,
        type: 'image/webp'
    }
}).AssertWebsite();