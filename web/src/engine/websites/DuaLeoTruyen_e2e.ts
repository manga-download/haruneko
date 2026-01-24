import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'dualeotruyen',
        title: 'DuaLeoTruyen'
    },
    container: {
        url: 'https://dualeotruyenpe.com/truyen-tranh/peppermint-candy',
        id: '/truyen-tranh/peppermint-candy',
        title: '(ABO) Peppermint Candy'
    },
    child: {
        id: '/truyen-tranh/peppermint-candy/chapter-13',
        title: 'Chapter 13'
    },
    entry: {
        index: 45,
        size: 1_902_747,
        type: 'image/webp'
    }
}).AssertWebsite();