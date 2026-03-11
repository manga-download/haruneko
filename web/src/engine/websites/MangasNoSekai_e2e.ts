import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangasnosekai',
        title: 'Mangas No Sekai'
    },
    container: {
        url: 'https://mangasnosekai.com/manga/flops-de-amor/',
        id: '/manga/flops-de-amor/',
        title: 'Flops de Amor'
    },
    child: {
        id: '/manga/flops-de-amor/capitulo-19/',
        title: 'Capítulo 19'
    },
    entry: {
        index: 2,
        size: 334_434,
        type: 'image/webp'
    }
}).AssertWebsite();