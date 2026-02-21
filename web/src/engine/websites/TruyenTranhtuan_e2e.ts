import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'truyentranhtuan',
        title: 'TruyenTranhtuan',
    },
    container: {
        url: 'https://truyentranhtuan.me/ki-su-hoi-quy/',
        id: '/ki-su-hoi-quy/',
        title: 'Kí Sự Hồi Quy',
    },
    child: {
        id: '/ki-su-hoi-quy/chapter-177/',
        title: 'Chapter 175', //not a typo
    },
    entry: {
        index: 2,
        size: 739_493,
        type: 'image/jpeg',
    }
}).AssertWebsite();