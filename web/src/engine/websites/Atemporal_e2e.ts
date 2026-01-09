import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'atemporal',
        title: 'Atemporal',
    },
    container: {
        url: 'https://atemporal.cloud/manga/o-rei-coletor/',
        id: '/manga/o-rei-coletor/',
        title: 'O Rei Coletor'
    },
    child: {
        id: '/o-rei-coletor-capitulo-01/',
        title: 'Capítulo 1'
    },
    entry: {
        index: 1,
        size: 1_876_880,
        type: 'image/webp'
    }
}).AssertWebsite();