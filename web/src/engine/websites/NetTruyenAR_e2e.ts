import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'nettruyenar',
        title: 'NetTruyenAR',
    },
    container: {
        url: 'https://nettruyenar.com/truyen-tranh/ta-co-90-ty-tien-liem-cau-16581',
        id: '/truyen-tranh/ta-co-90-ty-tien-liem-cau-16581',
        title: 'Ta Có 90 Tỷ Tiền Liếm Cẩu!',
    },
    child: {
        id: '/truyen-tranh/ta-co-90-ty-tien-liem-cau/chapter-529/547',
        title: 'Chapter 529',
    },
    entry: {
        index: 0,
        size: 501_617,
        type: 'image/jpeg',
    }
}).AssertWebsite();