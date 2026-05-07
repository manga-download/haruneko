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
        id: '/manga/guarda-fantasmas/14/',
        title: '14 Amamiya'
    },
    entry: {
        index: 0,
        size: 152_680,
        type: 'image/webp'
    }
}).AssertWebsite();