import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'plottwistnofansub',
        title: 'Plot Twist No Fansub'
    },
    container: {
        url: 'https://plotnofansub.com/manga/guarda-fantasmas/',
        id: '/manga/guarda-fantasmas/',
        title: 'Guarda-Fantasmas'
    },
    child: {
        id: '/manga/guarda-fantasmas/5/',
        title: '5 No tengo miedo'
    },
    entry: {
        index: 0,
        size: 164_516,
        type: 'image/webp'
    }
}).AssertWebsite();