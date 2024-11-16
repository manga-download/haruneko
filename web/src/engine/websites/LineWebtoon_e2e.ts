import './DongManManhua_e2e';
import './LineWebtoonTranslate_e2e';
import { TestFixture } from '../../../test/WebsitesFixture';

const configLayered = {
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

new TestFixture(configLayered).AssertWebsite();

const configRegular = {
    plugin: {
        id: 'linewebtoon',
        title: 'Line Webtoon',
    },
    container: {
        url: 'https://www.webtoons.com/en/comedy/do-you-like-tomboys/list?title_no=6595',
        id: '/en/comedy/do-you-like-tomboys/list?title_no=6595',
        title: 'Do You Like Tomboys?',
        timeout: 15000
    },
    child: {
        id: '/en/comedy/do-you-like-tomboys/episode-1/viewer?title_no=6595&episode_no=1',
        title: '#1 - Episode 1',
    },
    entry: {
        index: 0,
        size: 523_307,
        type: 'image/jpeg',
    }
};

new TestFixture(configRegular).AssertWebsite();
