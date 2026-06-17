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
        id: '/manga/flops-de-amor/capitulo-8/',
        title: 'Capítulo 8'
    },
    entry: {
        index: 2,
        size: 460_790,
        type: 'image/webp'
    }
}).AssertWebsite();