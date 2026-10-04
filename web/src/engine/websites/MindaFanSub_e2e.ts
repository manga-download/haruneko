import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mindafansub',
        title: 'Minda Fansub'
    },
    container: {
        url: 'https://mindafansub.dev/manga/painter-of-the-night-1/',
        id: JSON.stringify({ post: '112', slug: '/manga/painter-of-the-night-1/' }),
        title: 'Painter of the Night'
    },
    child: {
        id: '/manga/painter-of-the-night-1/bolum-1/',
        title: 'Bölüm 1'
    }, /* Login Needed
    entry: {
        index: 0,
        size: 209_831,
        type: 'image/jpeg'
    }*/
}).AssertWebsite();