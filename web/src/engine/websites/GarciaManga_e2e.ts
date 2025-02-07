import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'garciamanga',
        title: 'Garcia Manga'
    },
    container: {
        url: 'https://garciamanga.com/manga/star-wars-dark-empire/',
        id: JSON.stringify({ post: '1228', slug: '/manga/star-wars-dark-empire/' }),
        title: 'Star Wars: Dark Empire'
    },
    child: {
        id: '/manga/star-wars-dark-empire/bolum-12/',
        title: 'Bölüm 12'
    },
    entry: {
        index: 0,
        size: 424_777,
        type: 'image/jpeg'
    }
}).AssertWebsite();