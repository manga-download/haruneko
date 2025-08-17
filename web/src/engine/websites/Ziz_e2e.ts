import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'drakescans',
        title: 'Ziz'
    },
    container: {
        url: 'https://www.zzizz.xyz/manga/idle-player-returns-as-a-god/',
        id: '/manga/idle-player-returns-as-a-god/',
        title: 'Idle Player Returns as a God'
    },
    child: {
        id: '/reader/manga/idle-player-returns-as-a-god/1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 724_272,
        type: 'image/webp'
    }
}).AssertWebsite();