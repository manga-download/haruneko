import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangatoon-vi',
        title: 'MangaToon (Vietnamese)',
    },
    container: {
        url: 'https://mangatooncom.vn/vi/hinh-tuong-daddy-cua-toi-sup-do-roi?content_id=340499',
        id: '340499',
        title: 'Hình Tượng Daddy Của Tôi Sụp Đổ Rồi'
    },
    child: {
        id: '94527',
        title:'Chapter 1'
    },
    entry: {
        index: 6,
        size: 15_762,
        type: 'image/webp'
    }
}).AssertWebsite();