import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'truyentranhlh',
        title: 'TruyentranhLH'
    },
    container: {
        url: 'https://truyentranhlh.net/truyen-tranh/tho-ren-huyen-thoai',
        id: '/truyen-tranh/tho-ren-huyen-thoai',
        title: 'Thợ Rèn Huyền Thoại'
    },
    child: {
        id: '/truyen-tranh/tho-ren-huyen-thoai/chapter-188-227',
        title: 'Chapter 188',
    },
    entry: {
        index: 0,
        size: 232_191,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());