import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangazure',
        title: 'Mangazure'
    },
    container: {
        url: 'https://mangazure.net/manga/serena/',
        id: JSON.stringify({ post: '252', slug: '/manga/serena/' }),
        title: 'Serena'
    },
    child: {
        id: '/manga/serena/bolum-107/',
        title: 'Bölüm 107'
    },
    entry: {
        index: 0,
        size: 279_669,
        type: 'image/jpeg'
    }
}).AssertWebsite();