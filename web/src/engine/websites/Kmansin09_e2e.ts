import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'kmansin09',
        title: 'K-漫神 (Kmansin09)'
    },
    container: {
        url: 'https://kmansin09.top/manga/uchinopapaha-neng-li-zhedeshita/',
        id: JSON.stringify({ post: '8475', slug: '/manga/uchinopapaha-neng-li-zhedeshita/' }),
        title: 'うちのパパは能力者でした'
    },
    child: {
        id: '/manga/uchinopapaha-neng-li-zhedeshita/di36hua/',
        title: '第36話'
    },
    entry: {
        index: 10,
        size: 445_294,
        type: 'image/webp'
    }
}).AssertWebsite();