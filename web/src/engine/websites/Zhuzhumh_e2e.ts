import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'zhuzhumh',
        title: 'Zhuzhumh'
    },
    container: {
        url: 'https://www.zhuzhumh.com/book/shisiruguiweijunzi.html',
        id: '/book/shisiruguiweijunzi.html',
        title: '视死如归魏君子'
    },
    child: {
        id: '/chapter-redirect/shisiruguiweijunzi/1364147.html',
        title: '93 四大纨绔之三'
    },
    entry: {
        index: 0,
        size: 863_947,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());