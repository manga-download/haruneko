import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'jmanga',
        title: 'JManga'
    },
    container: {
        url: 'https://jmanga.org/read/%E3%81%8B%E3%82%89%E3%81%8B%E3%81%84%E4%B8%8A%E6%89%8B-%EF%BC%9F-%E3%81%AE%E8%A5%BF%E7%89%87%E3%81%95%E3%82%93.1-raw/',
        id: '/read/%E3%81%8B%E3%82%89%E3%81%8B%E3%81%84%E4%B8%8A%E6%89%8B-%EF%BC%9F-%E3%81%AE%E8%A5%BF%E7%89%87%E3%81%95%E3%82%93.1-raw/',
        title: 'からかい上手(？)の西片さん'
    },
    child: {
        id: '/read/%E3%81%8B%E3%82%89%E3%81%8B%E3%81%84%E4%B8%8A%E6%89%8B-%EF%BC%9F-%E3%81%AE%E8%A5%BF%E7%89%87%E3%81%95%E3%82%93/ja/chapter-7-raw/',
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