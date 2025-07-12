import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'sarcasmscans',
        title: 'Sarcasm Scans'
    },
    container: {
        url: 'https://sarcasmscans.com/manga/twisted-soul/',
        id: JSON.stringify({ post: '300', slug: '/manga/twisted-soul/' }),
        title: 'Bozulmuş Ruh'
    },
    child: {
        id: '/manga/twisted-soul/bolum-1/',
        title: 'bölüm 1'
    },
    entry: {
        index: 1,
        size: 4_441_943,
        type: 'image/jpeg'
    }
}).AssertWebsite();