import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
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
        size: 1_869_995,
        type: 'image/png'
    }
};

new TestFixture(config).AssertWebsite();