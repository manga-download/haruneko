import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'grimelek',
        title: 'Siyah Melek'
    },
    container: {
        url: 'https://siyahmelek.lat/manga/friends/',
        id: '/manga/friends/',
        title: 'Friends'
    },
    child: {
        id: '/manga/friends/bolum-40/',
        title: 'Bölüm 40'
    },
    entry: {
        index: 0,
        size: 52_598,
        type: 'image/jpeg'
    }
}).AssertWebsite();