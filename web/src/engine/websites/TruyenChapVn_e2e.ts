import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'truyenchapvn',
        title: 'TruyenChapVn'
    },
    container: {
        url: 'https://truyen.chap.vn/truyen/one-piece-i2-128/',
        id: '/truyen/one-piece-i2-128/',
        title: 'ONE PIECE'
    },
    child: {
        id: '/truyen/one-piece-i2-128/chap-1046-306210.html',
        title: 'Chap 1046',
    },
    entry: {
        index: 0,
        size: 415_519,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());