import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'nettruyengg',
        title: 'NetTruyen GG',
    },
    container: {
        url: 'https://nettruyen.gg/truyen-tranh/ta-co-90-ty-tien-liem-cau',
        id: '/truyen-tranh/ta-co-90-ty-tien-liem-cau',
        title: 'Ta Có 90 Tỷ Tiền Liếm Cẩu!',
    },
    child: {
        id: '/truyen-tranh/ta-co-90-ty-tien-liem-cau/chapter-529',
        title: 'Chapter 529',
    },
    entry: {
        index: 0,
        size: 501_617,
        type: 'image/jpeg',
    }
}).AssertWebsite();