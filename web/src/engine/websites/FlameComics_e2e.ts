import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'flamecomics',
        title: 'Flame Comics',
    },
    container: {
        url: 'https://flamecomics.xyz/series/44',
        id: '44',
        title: 'Solo Necromancy',
        timeout: 15_000
    },
    child: {
        id: '503e0f7071083096',
        title: 'Chapter 1.0'
    },
    entry: {
        index: 2,
        size: 947_020,
        type: 'image/jpeg'
    }
}).AssertWebsite();