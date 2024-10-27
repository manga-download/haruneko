import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'truyentranhtuan',
        title: 'TruyenTranhtuan'
    },
    container: {
        url: 'https://truyentuan.xyz/huyen-thoai-giao-si-tro-lai/',
        id: '/huyen-thoai-giao-si-tro-lai/',
        title: 'Huyền Thoại Giáo Sĩ Trở Lại'
    },
    child: {
        id: '/huyen-thoai-giao-si-tro-lai-chuong-98/',
        title: '98'
    },
    entry: {
        index: 0,
        size: 120_129,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();