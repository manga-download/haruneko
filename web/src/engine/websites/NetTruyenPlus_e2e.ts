import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'nettruyen#C844E3A7',
        title: 'NetTruyen Plus',
    },
    container: {
        url: 'https://www.nettruyenplus.net/truyen-tranh/ta-co-90-ty-tien-liem-cau-31450',
        id: '/truyen-tranh/ta-co-90-ty-tien-liem-cau-31450',
        title: 'Ta Có 90 Tỷ Tiền Liếm Cẩu!',
    },
    child: {
        id: '/truyen-tranh/ta-co-90-ty-tien-liem-cau/chapter-200/1496872',
        title: 'Chapter 200',
    },
    entry: {
        index: 0,
        size: 301_902,
        type: 'image/jpeg',
    },
}).AssertWebsite();