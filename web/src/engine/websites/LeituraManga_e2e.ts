import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'leituramanga',
        title: 'LeituraManga'
    },
    container: {
        url: 'https://leituramanga.net/manga/o-campo-esquecido',
        id: '/manga/o-campo-esquecido',
        title: 'O Campo Esquecido'
    },
    child: {
        id: '/manga/o-campo-esquecido/chapter/1',
        title: 'Capítulo 1'
    },
    entry: {
        index: 1,
        size: 364_040,
        type: 'image/webp'
    }
}).AssertWebsite();