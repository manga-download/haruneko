import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'dualeotruyen',
        title: 'DuaLeoTruyen'
    },
    container: {
        url: 'https://dualeotruyengf.com/truyen-tranh/peppermint-candy',
        id: '/truyen-tranh/peppermint-candy',
        title: '(ABO) Peppermint Candy'
    },
    child: {
        id: '/truyen-tranh/peppermint-candy/chapter-13',
        title: 'Chapter 13'
    },
    entry: {
        index: 45,
        size: 204_590,
        type: 'image/webp'
    }
}).AssertWebsite();