import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'traduccionesmoonlight',
        title: 'Traducciones Moonlight',
    },
    container: {
        url: 'https://traduccionesmoonlight.com/ver/sacrificio-humano',
        id: '/ver/sacrificio-humano',
        title: 'SACRIFICIO HUMANO'
    },
    child: {
        id: '/ver/sacrificio-humano/1',
        title: 'Capítulo 1'
    },
    entry: {
        index: 3,
        size: 1_863_663,
        type: 'image/png'
    }
}).AssertWebsite();