import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'rimacomiplus',
        title: 'RimacomiPlus (リマコミ＋)',
    },
    container: {
        url: 'https://rimacomiplus.jp/cocohana/series/853b5f1c905d4/',
        id: '/cocohana/series/853b5f1c905d4',
        title: '包帯ごっこ',
    },
    child: {
        id: '/cocohana/episodes/7cba174d95a20/',
        title: '第1話',
    },
    entry: {
        index: 1,
        size: 1_627_547,
        type: 'image/png',
    }
}).AssertWebsite();