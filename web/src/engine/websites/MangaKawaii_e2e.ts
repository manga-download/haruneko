import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangakawaii',
        title: 'MangaKawaii',
    },
    container: {
        url: 'https://www.mangakawaii.fr/manga/the-strongest-god-king',
        id: '/manga/the-strongest-god-king',
        title: 'The Strongest God King',

    },
    child: {
        id: '/manga/the-strongest-god-king/210',
        title: 'Ch. 210'
    },
    entry: {
        index: 2,
        size: 221_425,
        type: 'image/jpeg'
    }
}).AssertWebsite();