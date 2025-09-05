import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'jenta',
        title: 'J-Enta'
    },
    container: {
        url: 'https://comic.j-nbooks.jp/series/d2997c88e1a65',
        id: '/series/d2997c88e1a65',
        title: '異世界でテイムした最強の使い魔は、幼馴染の美少女でした'
    },
    child: {
        id: '/episodes/e3e816ad49223/',
        title: '第1話①'
    },
    entry: {
        index: 8,
        size: 1_574_450,
        type: 'image/png',
    }
}).AssertWebsite();