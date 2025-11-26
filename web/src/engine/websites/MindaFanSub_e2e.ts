import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mindafansub',
        title: 'Minda Fansub'
    },
    container: {
        url: 'https://mindafansub.lol/manga/painter-of-the-night/',
        id: JSON.stringify({ post: '112', slug: '/manga/painter-of-the-night/'}),
        title: 'Painter of the Night'
    },
    child: {
        id: '/manga/painter-of-the-night/bolum-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 0,
        size: 209_831,
        type: 'image/jpeg'
    }
}).AssertWebsite();