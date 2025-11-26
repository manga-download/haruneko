import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'youngchampion',
        title: 'Young Champion'
    },
    container: {
        url: 'https://youngchampion.jp/series/b20f6fa2cc69a',
        id: '/series/b20f6fa2cc69a',
        title: '惨家'
    },
    child: {
        id: '/episodes/71edbfc76e327/',
        title: '第1話'
    },
    entry: {
        index: 0,
        size: 2_895_369,
        type: 'image/png',
    }
}).AssertWebsite();