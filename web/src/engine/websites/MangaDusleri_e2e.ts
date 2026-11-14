import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangadusleri',
        title: 'MangaDusleri',
    },
    container: {
        url: 'https://mangadusleri.mom/manga/codename-anastasia',
        id: '/manga/codename-anastasia',
        title: 'Codename Anastasia'
    },
    child: {
        id: '/oku/codename-anastasia/bolum-71',
        title: 'Bölüm 71'
    }, /* Login needed
    entry: {
        index: 2,
        size: 473_537,
        type: 'image/png'
    }*/
}).AssertWebsite();