import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'takecomic',
        title: 'TakeComic'
    },
    container: {
        url: 'https://takecomic.jp/series/02b1bb355bf29',
        id: '/series/02b1bb355bf29',
        title: '年齢制限付き乙女ゲーの悪役令嬢ですが、堅物騎士様が優秀過ぎてRイベントが一切おきない'
    },
    child: {
        id: '/episodes/3984bbf3a37b6',
        title: '0話'
    },
    entry: {
        index: 0,
        size: 1_238_484,
        type: 'image/png',
    }
}).AssertWebsite();