import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangastep',
        title: 'MangaStep'
    },
    container: {
        url: 'https://mangastep.com/manga/overgeared-remake/',
        id: '/manga/overgeared-remake/',
        title: 'Overgeared (Remake)'
    },
    child: {
        id: encodeURI('/overgeared-remake-ตอนที่-215/').toLowerCase(),
        title: 'ตอนที่ 215'
    },
    entry: {
        index: 0,
        size: 498_942,
        type: 'image/jpeg'
    }
}).AssertWebsite();