import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'hayalistic',
        title: 'Hayalistic'
    },
    container: {
        url: 'https://hayalistic.net/manga/gorunus/',
        id: JSON.stringify({ post: '3389', slug: '/manga/gorunus/' }),
        title: 'Görünüşçülük'
    },
    child: {
        id: '/manga/gorunus/bolum-1/',
        title: 'Bölüm 1 - Hyung Suk’un İki Bedeni Var (1)'
    },
    entry: {
        index: 0,
        size: 492_090,
        type: 'image/jpeg'
    }
}).AssertWebsite();