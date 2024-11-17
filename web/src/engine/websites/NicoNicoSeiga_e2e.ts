import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'niconicoseiga',
        title: 'ニコニコ静画 (niconico seiga)'
    },
    container: {
        url: 'https://manga.nicovideo.jp/comic/62094',
        id: '62094',
        title: '寿司ガキ'
    },
    child: {
        id: '712584',
        title: '第1話'
    },
    entry: {
        index: 0,
        size: 199_413,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();