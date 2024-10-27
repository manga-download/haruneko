import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'nhattruyen',
        title: 'NhatTruyen'
    },
    container: {
        url: 'https://nhattruyenvn.com/truyen-tranh/initial-d',
        id: '/truyen-tranh/initial-d',
        title: 'Initial D'
    },
    child: {
        id: '/truyen-tranh/initial-d/chuong-712',
        title: 'Chapter 712'
    },
    entry: {
        index: 0,
        size: 247_096,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();