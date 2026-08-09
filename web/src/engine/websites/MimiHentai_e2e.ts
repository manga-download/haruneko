import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mimihentai',
        title: 'MimiHentai'
    },
    container: {
        url: 'https://mimihentai.net/truyen/luc-thay-luc-khong',
        id: '/truyen/luc-thay-luc-khong',
        title: 'Lúc thấy, lúc không'
    },
    child: {
        id: '/truyen/luc-thay-luc-khong/oneshot-khong-che',
        title: 'Oneshot không che'
    },
    entry: {
        index: 2,
        size: 1_110_706,
        type: 'image/webp'
    }
}).AssertWebsite();