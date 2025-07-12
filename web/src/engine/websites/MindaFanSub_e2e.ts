import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mindafansub',
        title: 'Minda Fansub'
    },
    container: {
        url: 'https://mindafansub.my/manga/painter-of-the-night-oku-10/',
        id: JSON.stringify({ post: '112', slug: '/manga/painter-of-the-night-oku-10/'}),
        title: 'Painter of the Night'
    },
    child: {
        id: '/manga/painter-of-the-night-oku-10/bolum-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 0,
        size: 209_831,
        type: 'image/jpeg'
    }
}).AssertWebsite();