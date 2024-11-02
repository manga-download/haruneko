import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'linewebtoon',
        title: 'Line Webtoon',
    },
    container: {
        url: 'https://www.webtoons.com/id/horror/guidao/list?title_no=874',
        id: '/id/horror/guidao/list?title_no=874',
        title: 'Ghost Path',
        timeout: 15000
    },
    child: {
        id: '/id/horror/guidao/prolog/viewer?title_no=874&episode_no=1',
        title: '#1 - Prolog',
        timeout: 20000
    },
    entry: {
        index: 2,
        size: 282_499,
        type: 'image/png',
    }
};

new TestFixture(config).AssertWebsite();