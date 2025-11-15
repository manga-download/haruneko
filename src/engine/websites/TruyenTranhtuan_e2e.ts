import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'truyentranhtuan',
        title: 'TruyenTranhtuan',
    },
    container: {
        url: 'https://truyentranhtuan.xyz/huyen-thoai-giao-si-tro-lai/',
        id: '/huyen-thoai-giao-si-tro-lai/',
        title: 'Huyền Thoại Giáo Sĩ Trở Lại',
    },
    child: {
        id: '/huyen-thoai-giao-si-tro-lai-chuong-98/',
        title: '98',
    },
    entry: {
        index: 0,
        size: 120_129,
        type: 'image/jpeg',
    }
}).AssertWebsite();