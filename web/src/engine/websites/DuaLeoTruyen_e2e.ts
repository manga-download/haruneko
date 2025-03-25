import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'dualeotruyen',
        title: 'DuaLeoTruyen'
    },
    container: {
        url: 'https://dualeotruyenbotz.com/truyen-tranh/list-truyenss-ngan-chit-chit.html',
        id: '/truyen-tranh/list-truyenss-ngan-chit-chit.html',
        title: 'LIST TRUYỆN NGẮN CHỊT CHỊT'
    },
    child: {
        id: '/truyen-tranh/list-truyenss-ngan-chit-chit/chapter-70.html',
        title: 'Chapter 70'
    },
    entry: {
        index: 1,
        size: 450_376,
        type: 'image/webp'
    }
}).AssertWebsite();