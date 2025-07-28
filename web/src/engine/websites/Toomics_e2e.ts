import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'toomics',
        title: 'Toomics (Global)'
    },
    container: {
        url: 'https://global.toomics.com/fr/webtoon/episode/toon/5048',
        id: '/fr/webtoon/episode/toon/5048',
        title: 'Chase Fortune [fr]'
    },
    child: {
        id: '/fr/webtoon/detail/code/100571/ep/1/toon/5048',
        title: 'Chase Fortune ép. 1 [fr]'
    },
    entry: {
        index: 0,
        size: 81_888,
        type: 'image/jpeg'
    }
}).AssertWebsite();