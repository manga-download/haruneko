import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'timenaight',
        title: 'TimeNaight'
    },
    container: {
        url: 'https://timenaight.org/manga/iskelet-asker/',
        id: JSON.stringify({ post: '15621', slug: '/manga/iskelet-asker/' }),
        title: 'İskelet Asker'
    },
    child: {
        id: '/manga/iskelet-asker/bolum-323/',
        title: 'Bölüm 323'
    },
    entry: {
        index: 3,
        size: 70_490,
        type: 'image/webp'
    }
}).AssertWebsite();