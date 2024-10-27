import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'barmanga',
        title: 'BarManga'
    },
    container: {
        url: 'https://barmanga.com/home/manga/aprendiz-por-favor-perdoname/',
        id: JSON.stringify({ post: '834', slug: '/home/manga/aprendiz-por-favor-perdoname/' }),
        title: '¡Aprendiz! ¡Por favor perdóname!'
    },
    child: {
        id: '/home/manga/aprendiz-por-favor-perdoname/capitulo-212/',
        title: 'Capítulo 212'
    },
    entry: {
        index: 2,
        size: 709_358,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();