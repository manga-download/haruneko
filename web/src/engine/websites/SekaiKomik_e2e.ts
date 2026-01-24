import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'sekaikomik',
        title: 'SekaiKomik'
    },
    container: {
        url: 'https://www.sekaikomik.lat/manga/circles/',
        id: '/manga/circles/',
        title: 'Circles'
    },
    child: {
        id: '/circles-chapter-1/',
        title: 'Chapter 1',
        timeout: 15000
    },
    entry: {
        index: 2,
        size: 278_267,
        type: 'image/jpeg'
    }
}).AssertWebsite();