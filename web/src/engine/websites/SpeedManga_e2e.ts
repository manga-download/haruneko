import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'speedmanga',
        title: 'Speed Manga',
    },
    container: {
        url: 'https://speed-manga.com/manga/99-wooden-stick/',
        id: '/manga/99-wooden-stick/',
        title: '+99 Wooden Stick'
    },
    child: {
        id: '/99-wooden-stick-213/',
        title: 'ตอนที่ 213',
        timeout: 20_000
    },
    entry: {
        index: 1,
        size: 417_884,
        type: 'image/jpeg'
    }
}).AssertWebsite();