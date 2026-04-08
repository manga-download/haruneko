import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'plottwistnofansub',
        title: 'Plot Twist No Fansub'
    },
    container: {
        url: 'https://plotnf.com/plotwist/manga/guarda-fantasmas/',
        id: '/plotwist/manga/guarda-fantasmas/',
        title: 'Guarda-Fantasmas',
        timeout: 30_000
    },
    child: {
        id: '/reader/guarda-fantasmas/chapter-5.00/',
        title: 'Capítulo 5.00: No tengo miedo'
    },
    entry: {
        index: 0,
        size: 884_617,
        type: 'image/png'
    }
}).AssertWebsite();