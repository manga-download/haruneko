import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'barmanga',
        title: 'BarManga'
    },
    container: {
        url: 'https://libribar.com/manga/aprendiz-por-favor-perdoname/',
        id: JSON.stringify({ post: '834', slug: '/manga/aprendiz-por-favor-perdoname/' }),
        title: '¡Aprendiz! ¡Por favor perdóname!'
    },
    child: {
        id: '/manga/aprendiz-por-favor-perdoname/capitulo-212/',
        title: 'Capítulo 212'
    },
    entry: {
        index: 2,
        size: 709_358,
        type: 'image/jpeg'
    }
}).AssertWebsite();