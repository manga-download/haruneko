import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'hentaiscantrad',
        title: 'Hentai-Scantrad'
    },
    container: {
        url: 'https://hentai.scantrad-vf.cc/manga/secret-class/',
        id: JSON.stringify({ post: '4478', slug: '/manga/secret-class/' }),
        title: 'Secret Class'
    },
    child: {
        id: '/manga/secret-class/chapitre-274/',
        title: 'Chapitre 274'
    },
    entry: {
        index: 0,
        size: 1_008_199,
        type: 'image/jpeg'
    }
}).AssertWebsite();