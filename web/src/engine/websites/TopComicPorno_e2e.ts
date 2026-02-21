import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'topcomicporno',
        title: 'Top Comic Porno'
    },
    container: {
        url: 'https://topcomicporno.net/manga/netorare-manga-no-kuzu-otoko-ni-tensei-shita-hazu-ga-heroine-ga-yottekuru-ken/',
        id: JSON.stringify({ post: '13977', slug: '/manga/netorare-manga-no-kuzu-otoko-ni-tensei-shita-hazu-ga-heroine-ga-yottekuru-ken/' }),
        title: 'Netorare Manga no Kuzu Otoko ni Tensei shita Hazu ga Heroine ga Yottekuru Ken'
    },
    child: {
        id: '/manga/netorare-manga-no-kuzu-otoko-ni-tensei-shita-hazu-ga-heroine-ga-yottekuru-ken/capitulo-1/',
        title: 'Capitulo 1'
    },
    entry: {
        index: 3,
        size: 361_558,
        type: 'image/webp'
    }
}).AssertWebsite();