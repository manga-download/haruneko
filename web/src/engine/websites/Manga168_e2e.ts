import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manga168',
        title: 'Manga168'
    },
    container: {
        url: 'https://manga168x.com/manga/overgeared-remake',
        id: '/manga/overgeared-remake',
        title: 'Overgeared (Remake)'
    },
    child: {
        id: '/manga/overgeared-remake/chapter/ch-215',
        title: 'ตอนที่ 215'
    },
    entry: {
        index: 0,
        size: 498_942,
        type: 'image/jpeg'
    }
}).AssertWebsite();