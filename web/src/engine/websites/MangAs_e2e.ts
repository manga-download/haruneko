import { TestFixture } from '../../../test/WebsitesFixture';

//Case : direct pictures links

new TestFixture({
    plugin: {
        id: 'mangas',
        title: 'MangAs',
    },
    container: {
        url: 'https://m440.in/manga/one-piece',
        id: '/manga/one-piece',
        title: 'One Piece',
    },
    child: {
        id: '/manga/one-piece/1097-gpap2',
        title: '#1097 ⠇Ginny',
    },
    entry: {
        index: 6,
        size: 278_405,
        type: 'image/jpeg',
    }
}).AssertWebsite();

//Case : base64 pictures links

new TestFixture({
    plugin: {
        id: 'mangas',
        title: 'MangAs',
    },
    container: {
        url: 'https://m440.in/manga/kanojo-wa-sore-o-gaman-dekinai',
        id: '/manga/kanojo-wa-sore-o-gaman-dekinai',
        title: 'Kanojo wa Sore o Gaman Dekinai',
    },
    child: {
        id: '/manga/kanojo-wa-sore-o-gaman-dekinai/1',
        title: '#1 ⠇Déjame oler',
    },
    entry: {
        index: 0,
        size: 203_621,
        type: 'image/jpeg',
    }
}).AssertWebsite();