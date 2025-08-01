import { TestFixture } from '../../../test/WebsitesFixture';

// CASE : Chapter
new TestFixture({
    plugin: {
        id: 'lezhin-ja',
        title: 'Lezhin (Japanese)'
    },
    container: {
        url: 'https://lezhin.jp/comic/hikarikage',
        id: 'hikarikage',
        title: '光と影【連載】'
    },
    child: {
        id: JSON.stringify({ id: '01k0r83mds2fk2y2q73e0kxp2w', type: 'chapter' }),
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
        id: 't5_470281',
        title: '五等分の花嫁'
    },
    child: {
        id: JSON.stringify({ id: '01jqf186spk0b7ce0vwm0804s6', type: 'volume' }),
        title: '（１）'
    },
    entry: {
        index: 0,
        size: 75_322,
        type: 'image/webp'
    }
}).AssertWebsite();