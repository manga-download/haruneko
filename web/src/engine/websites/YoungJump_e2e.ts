import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'youngjump',
        title: 'となりのヤングジャンプ (Tonari no Young Jump)'
    },
    /* Content is accessible after login
    container: {
        url: 'https://www.youngjump.world/reader/reader.html?cid=101012340&u1=10001',
        id: '/reader/reader.html?cid=101012340&u1=10001',
        title: '俺だけ不遇スキルの異世界召喚叛逆記～最弱スキル【吸収】が全てを飲み込むまで～'
    },
    child: {
        id: '/reader/reader.html?cid=101012340&u1=10001',
        title: 'YJ2024_01 - 1'
    },
    entry: {
        index: 0,
        size: 4_627_863,
        type: 'image/png'
    }*/
};

new TestFixture(config).AssertWebsite();