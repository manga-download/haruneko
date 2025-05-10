/* NW.js crash on website initialize => CloudFlare
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'nhattruyen',
        title: 'NhatTruyen'
    },
    container: {
        url: 'https://nhattruyenqq.com/truyen-tranh/ta-troi-sinh-da-la-nhan-vat-phan-dien',
        id: '/truyen-tranh/ta-troi-sinh-da-la-nhan-vat-phan-dien',
        title: 'Ta Trời Sinh Đã Là Nhân Vật Phản Diện'
    },
    child: {
        id: '/truyen-tranh/ta-troi-sinh-da-la-nhan-vat-phan-dien/chuong-01',
        title: 'Chapter 1'
    },
    entry: {
        index: 2,
        size: 745_804,
        type: 'image/png'
    }
}).AssertWebsite();
*/