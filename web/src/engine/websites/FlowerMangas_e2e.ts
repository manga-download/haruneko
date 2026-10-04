import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'flowermangas',
        title: 'Flower Mangas'
    },
    container: {
        url: 'https://flowermangas.net/manga/a-princesa-marcou-o-traidor/',
        id: JSON.stringify({ post: '787', slug: '/manga/a-princesa-marcou-o-traidor/'}),
        title: 'A Princesa Marcou O Traidor'
    },
    child: {
        id: '/manga/a-princesa-marcou-o-traidor/capitulo-112/',
        title: 'Capítulo 112'
    },
    entry: {
        index: 0,
        size: 283_317,
        type: 'image/jpeg'
    }
}).AssertWebsite();