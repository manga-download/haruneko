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
        id: '/manhwa/la-tumba-del-cisne/capitulo-51/',
        title: 'Capítulo 51'
    },
    entry: {
        index: 5,
        size: 460_986,
        type: 'image/jpeg'
    }
}).AssertWebsite();
