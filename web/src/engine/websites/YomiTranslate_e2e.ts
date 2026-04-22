import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'yomitranslate',
        title: 'Yomi Translate'
    },
    container: {
        url: 'https://yomitranslate.com/series/reincarnators-stream',
        id: 'reincarnators-stream',
        title: 'Reincarnator’s Stream'
    },
    child: {
        id: '675',
        title: 'Chapter 45',
    },
    entry: {
        index: 0,
        size: 644_056,
        type: 'image/webp'
    }
}).AssertWebsite();