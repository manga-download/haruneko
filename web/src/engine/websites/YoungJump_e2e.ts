import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'youngjump',
        title: 'ヤングジャンプ / ウルトラジャンプ (young jump/ultra jump)'
    },
    /* Content is accessible after login
    container: {
        url: 'https://www.youngjump.world/reader/reader.html?cid=101016976&u1=10001',
        id: '/reader/reader.html?cid=101016976&u1=10001',
        title: 'YJ2026_42_43 - 42&43合併号'
    },
    child: {
        id: '/reader/reader.html?cid=101016976&u1=10001',
        title: 'YJ2026_42_43 - 42&43合併号'
    },
    entry: {
        index: 0,
        size: 4_627_863,
        type: 'image/png'
    }*/
}).AssertWebsite();