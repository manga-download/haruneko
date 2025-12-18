import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangaonlineblog',
        title: 'Manga Online Blog'
    },
    container: {
        url: 'https://mangaonline.app/manga/solo-max-level-newbie/',
        id: JSON.stringify({ post: '1895', slug: '/manga/solo-max-level-newbie/' }),
        title: 'Solo Max-Level Newbie',
    },
    child: {
        id: '/manga/solo-max-level-newbie/capitulo-234-pt-br/',
        title: 'capitulo 234 (PT-BR) -',
    },
    entry: {
        index: 0,
        size: 395_538,
        type: 'image/webp'
    }
}).AssertWebsite();