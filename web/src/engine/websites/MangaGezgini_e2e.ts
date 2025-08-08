import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangagezgini',
        title: 'Manga Gezgini'
    },
    container: {
        url: 'https://mangagezgini.love/manga/tower-of-god/',
        id: JSON.stringify({ post: '3087', slug: '/manga/tower-of-god/' }),
        title: 'Tower of God'
    },
    child: {
        id: '/manga/tower-of-god/tower-of-god-bolum-609/',
        title: 'Bölüm 609'
    },
    entry: {
        index: 0,
        size: 94_142,
        type: 'image/jpeg'
    }
}).AssertWebsite();