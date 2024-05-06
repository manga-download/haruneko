import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'rawotaku',
        title: 'RawOtaku'
    },
    container: {
        url: 'https://rawotaku.com/read/%E3%82%BE%E3%83%B3100-%E3%82%BE%E3%83%B3%E3%83%93%E3%81%AB%E3%81%AA%E3%82%8B%E3%81%BE%E3%81%A7%E3%81%AB%E3%81%97%E3%81%9F%E3%81%84100%E3%81%AE%E3%81%93%E3%81%A8-raw/',
        id: '/read/%E3%82%BE%E3%83%B3100-%E3%82%BE%E3%83%B3%E3%83%93%E3%81%AB%E3%81%AA%E3%82%8B%E3%81%BE%E3%81%A7%E3%81%AB%E3%81%97%E3%81%9F%E3%81%84100%E3%81%AE%E3%81%93%E3%81%A8-raw/',
        title: 'ゾン100 〜ゾンビになるまでにしたい100のこと〜'
    },
    child: {
        id: '/read/%E3%82%BE%E3%83%B3100-%E3%82%BE%E3%83%B3%E3%83%93%E3%81%AB%E3%81%AA%E3%82%8B%E3%81%BE%E3%81%A7%E3%81%AB%E3%81%97%E3%81%9F%E3%81%84100%E3%81%AE%E3%81%93%E3%81%A8/ja/chapter-65-raw/',
        title: '章 65: 第65話'
    },
    entry: {
        index: 0,
        size: 567_516,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());