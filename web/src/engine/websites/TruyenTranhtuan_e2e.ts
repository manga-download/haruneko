import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'truyentranhtuan',
        title: 'TruyenTranhtuan'
    },
    container: {
        url: 'https://truyentuan.com/huyen-thoai-giao-si-tro-lai/',
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

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());