import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'rimacomiplus',
        title: 'RimacomiPlus (リマコミ＋)'
    },
    container: {
        url: 'https://rimacomiplus.jp/cocohana/series/853b5f1c905d4/',
        id: '/cocohana/series/853b5f1c905d4/',
        title: '包帯ごっこ'
    },
    child: {
        id: '/cocohana/episodes/7cba174d95a20/',
        title: '第1話'
    },
    entry: {
        index: 0,
        size: 3_686_629,
        type: 'image/png'
    }
};

new TestFixture(config).AssertWebsite();