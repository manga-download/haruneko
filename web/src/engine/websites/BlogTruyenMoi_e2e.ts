import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Fetch XHR
new TestFixture({
    plugin: {
        id: 'blogtruyenmoi',
        title: 'BlogTruyenMoi',
        timeout: 60000
    },
    container: {
        url: 'https://blogtruyenmoi.com/31940/arika-cua-toi',
        id: '/31940/arika-cua-toi',
        title: 'Arika của tôi (Hết)',
        timeout: 60000
    },
    child: {
        id: '/c867145/arika-cua-toi-chuong-50-gia-tri-cua-chi-rieng-minh-toi',
        title: 'Chương 50: Giá trị của chỉ riêng mình tôi',
        timeout: 60000
    },
    entry: {
        index: 2,
        size: 331_954,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// CASE: Fetch JS
new TestFixture({
    plugin: {
        id: 'blogtruyenmoi',
        title: 'BlogTruyenMoi',
        timeout: 60000
    },
    container: {
        url: 'https://blogtruyenmoi.com/24834/jiken-kisha-totoko',
        id: '/24834/jiken-kisha-totoko',
        title: 'TOTOKO - PHÓNG VIÊN HÌNH SỰ',
        timeout: 60000
    },
    child: {
        id: '/c795471/jiken-kisha-totoko-chuong-27-naito-de-nhi-phong-nhu-bay-va-thu-do-tokyo-roi-vao-hon-loan',
        title: 'Chương 27 - Naito đệ nhị phóng như bay và thủ đô Tokyo rơi vào hỗn loạn',
        timeout: 60000
    },
    entry: {
        index: 0,
        size: 110_406,
        type: 'image/jpeg'
    }
}).AssertWebsite();