import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'grimelek',
        title: 'Grimelek'
    },
    container: {
        url: 'https://siyahmelek.lol/manga/friends/',
        id: '/manga/friends/',
        title: 'Friends'
    },
    child: {
        id: '/manga/revenge-by-harem/bolum-13/',
        title: 'Bölüm 40'
    },
    entry: {
        index: 2,
        size: 55_509,
        type: 'image/jpeg'
    }
}).AssertWebsite();