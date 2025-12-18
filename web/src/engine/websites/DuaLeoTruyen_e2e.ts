import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'dualeotruyen',
        title: 'DuaLeoTruyen'
    },
    container: {
        url: 'https://dualeotruyenjd.com/truyen-tranh/peppermint-candy.html',
        id: '/truyen-tranh/peppermint-candy.html',
        title: '(ABO) Peppermint Candy'
    },
    child: {
        id: '/truyen-tranh/peppermint-candy/chapter-13.html',
        title: 'Chapter 13'
    },
    entry: {
        index: 1,
        size: 340_096,
        type: 'image/webp'
    }
}).AssertWebsite();