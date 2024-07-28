import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'jmanga',
        title: 'JManga'
    },
    container: {
        url: encodeURI('https://jmanga.org/read/からかい上手-？-の西片さん.1-raw/'),
        id: encodeURI('/read/からかい上手-？-の西片さん.1-raw/'),
        title: 'からかい上手(？)の西片さん'
    },
    child: {
        id: encodeURI('/read/からかい上手-？-の西片さん/ja/chapter-7-raw/'),
        title: '章 7: 第7話'
    },
    entry: {
        index: 0,
        size: 153_198,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());