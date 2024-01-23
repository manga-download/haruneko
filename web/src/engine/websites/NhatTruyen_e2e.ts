import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'nhattruyen',
        title: 'NhatTruyen'
    },
    container: {
        url: 'https://nhattruyento.com/truyen-tranh/initial-d-2658',
        id: '/truyen-tranh/initial-d-2658',
        title: 'Initial D'
    },
    child: {
        id: '/truyen-tranh/initial-d/chap-712/1121626',
        title: 'Chapter 712'
    },
    entry: {
        index: 0,
        size: 316_031,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());