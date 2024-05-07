import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: '78te',
        title: '78te (特漫网)'
    },
    container: {
        url: 'https://www.17te.com/cartoon/581',
        id: '/cartoon/581',
        title: '家庭教师()'
    },
    child: {
        id: '/chapter/37638',
        title: '第1话 幻想'
    },
    entry: {
        index: 0,
        size: 48_149,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());