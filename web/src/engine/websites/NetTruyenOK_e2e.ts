/* NW.js crash on website initialize => CloudFlare
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'nettruyen#A4F21DC2',
        title: 'NetTruyen OK',
    },
    container: {
        url: 'https://nettruyen1975.com/manga/ta-co-90-ty-tien-liem-cau',
        id: '/manga/ta-co-90-ty-tien-liem-cau',
        title: 'Ta Có 90 Tỷ Tiền Liếm Cẩu!',
    },
    child: {
        id: '/manga/ta-co-90-ty-tien-liem-cau/chapter-200',
        title: 'Chapter 200',
    },
    entry: {
        index: 1,
        size: 193_514,
        type: 'image/jpeg',
    }
}).AssertWebsite();
*/