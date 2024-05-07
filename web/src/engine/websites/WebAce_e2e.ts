import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'webace',
        title: 'webエース (web ace)'
    },
    container: {
        url: 'https://web-ace.jp/youngaceup/contents/1000188/',
        id: '/youngaceup/contents/1000188/',
        title: 'ひぐらしのなく頃に 巡'
    },
    child: {
        id: '/youngaceup/contents/1000188/episode/8095/',
        title: '第１８話-３'
    },
    entry: {
        index: 0,
        size: 317_431,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());