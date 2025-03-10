import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'rawotaku',
        title: 'RawOtaku',
    },
    container: {
        url: encodeURI('https://rawotaku.com/read/ゾン100-ゾンビになるまでにしたい100のこと-raw/'),
        id: encodeURI('/read/ゾン100-ゾンビになるまでにしたい100のこと-raw/'),
        title: 'ゾン100 〜ゾンビになるまでにしたい100のこと〜',
    },
    child: {
        id: encodeURI('/read/ゾン100-ゾンビになるまでにしたい100のこと/ja/chapter-65-raw/'),
        title: '章 65: 第65話',
    },
    entry: {
        index: 0,
        size: 567_516,
        type: 'image/webp',
    }
}).AssertWebsite();