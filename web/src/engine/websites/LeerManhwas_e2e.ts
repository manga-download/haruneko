import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'leermanhwas',
        title: 'LeerManhwas'
    },
    container: {
        url: 'https://leermanhwas.com/manhwa/la-tumba-del-cisne/',
        id: '/manhwa/la-tumba-del-cisne/',
        title: 'La tumba del cisne'
    },
    child: {
        id: '/manhwa/la-tumba-del-cisne/capitulo-1/',
        title: 'Capítulo 1'
    },
    entry: {
        index: 0,
        size: 504_665,
        type: 'image/jpeg'
    }
}).AssertWebsite();
