import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'rawotaku',
        title: 'RawOtaku'
    },
    container: {
        url: encodeURI('https://rawotaku.com/read/ゾン100-ゾンビになるまでにしたい100のこと-raw/'),
        id: encodeURI('/read/ゾン100-ゾンビになるまでにしたい100のこと-raw/'),
        title: 'ゾン100 〜ゾンビになるまでにしたい100のこと〜'
    },
    child: {
        id: encodeURI('/read/ゾン100-ゾンビになるまでにしたい100のこと/ja/chapter-65-raw/'),
        title: '章 65: 第65話'
    },
    entry: {
        index: 0,
        size: 567_516,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());