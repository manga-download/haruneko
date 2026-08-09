import { TestFixture } from '../../../test/WebsitesFixture';

// CASE : Chapter
new TestFixture({
    plugin: {
        id: 'lezhin-ja',
        title: 'Lezhin (Japanese)'
    },
    container: {
        url: 'https://lezhin.jp/comic/hikarikage',
        id: '/comic/hikarikage',
        title: '光と影【連載】'
    },
    child: {
        id: 'chapter/01k0r83mds2fk2y2q73e0kxp2w',
        title: '第1話'
    },
    entry: {
        index: 0,
        size: 85_182,
        type: 'image/webp'
    }
}).AssertWebsite();

// CASE : Volume
new TestFixture({
    plugin: {
        id: 'lezhin-ja',
        title: 'Lezhin (Japanese)'
    },
    container: {
        url: 'https://lezhin.jp/comic/t5_470281',
        id: '/comic/t5_470281',
        title: '五等分の花嫁'
    },
    child: {
        id: 'volume/01jqf186spk0b7ce0vwm0804s6',
        title: '（１）'
    },
    entry: {
        index: 0,
        size: 75_322,
        type: 'image/webp'
    }
}).AssertWebsite();