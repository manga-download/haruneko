import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'nhattruyen',
        title: 'NhatTruyen'
    },
    container: {
        url: 'https://nhattruyenv.com/truyen-tranh/shy',
        id: '/truyen-tranh/shy',
        title: 'Shy'
    },
    child: {
        id: '/truyen-tranh/shy/chuong-91',
        title: 'Chapter 91'
    },
    entry: {
        index: 0,
        size: 136_128,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();