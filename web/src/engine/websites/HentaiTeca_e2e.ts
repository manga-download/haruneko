import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'hentaiteca',
        title: 'HentaiTeca'
    },
    container: {
        url: 'https://hentaiteca.net/obra/mousou-theater-66/',
        id: JSON.stringify({ post: '2259', slug: '/obra/mousou-theater-66/' }),
        title: 'MOUSOU THEATER 66',
    },
    child: {
        id: '/obra/mousou-theater-66/ler-capitulo/',
        title: 'Ler Capítulo'
    },
    entry: {
        index: 0,
        size: 264_214,
        type: 'image/webp'
    }
}).AssertWebsite();