import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'comicpolaris',
        title: 'COMICポラリス (COMIC Polaris)'
    },
    container: {
        url: 'https://comic-polaris.jp/ekidemita/',
        id: '/ekidemita/',
        title: '今日、駅で見た可愛い女の子。'
    },
    child: {
        id: '/ptdata/ekidemita/0001/',
        title: '第1話'
    },
    entry: {
        index: 0,
        size: 1_874_610,
        type: 'image/png'
    }
}).AssertWebsite();