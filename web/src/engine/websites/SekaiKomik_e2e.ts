import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'sekaikomik',
        title: 'SekaiKomik'
    },
    container: {
        url: 'https://sekaikomik.baby/manga/circles/',
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
        size: 259_614,
        type: 'image/jpeg'
    }
}).AssertWebsite();