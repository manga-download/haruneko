import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'herotruyen',
        title: 'Hero Truyen'
    },
    container: {
        url: 'https://truyenti.com/chung-cuc-dau-la',
        id: '/chung-cuc-dau-la',
        title: 'Chung Cực Đấu La'
    },
    child: {
        id: '/chung-cuc-dau-la/chapter-550',
        title: 'Chapter 550'
    },
    entry: {
        index: 0,
        size: 218_070,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();