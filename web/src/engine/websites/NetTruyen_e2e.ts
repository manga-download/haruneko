import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'nettruyen',
        title: 'NetTruyen'
    },
    container: {
        url: 'https://www.nettruyenbb.com/truyen-tranh/sau-khi-max-do-yeu-thich-550760',
        id: '/truyen-tranh/sau-khi-max-do-yeu-thich-550760',
        title: 'Sau Khi Max Độ Yêu Thích'
    },
    child: {
        id: '/truyen-tranh/sau-khi-max-do-yeu-thich/chap-161/1121574',
        title: 'Chapter 161'
    },
    entry: {
        index: 0,
        size: 1_806_313,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());