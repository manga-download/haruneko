import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Plain Images
new TestFixture({
    plugin: {
        id: 'bomtoon',
        title: 'Bomtoon',
        timeout: 20000
    },
    container: {
        url: 'https://www.bomtoon.com/detail/not_friend_all',
        id: 'not_friend_all',
        title: '친구말고 [개정판]'
    },
    child: {
        id: '1',
        title: '1화'
    },
    entry: {
        index: 0,
        size: 66_636,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// CASE: Scrambled Images
new TestFixture({
    plugin: {
        id: 'bomtoon',
        title: 'Bomtoon',
        timeout: 20000
    },
    container: {
        url: 'https://www.bomtoon.com/detail/spinach_fl',
        id: 'spinach_fl',
        title: '시금치 꽃다발'
    },
    child: {
        id: 'p0',
        title: '미리보기'
    },
    entry: {
        index: 0,
        size: 1_736_022,
        type: 'image/png'
    }
}).AssertWebsite();