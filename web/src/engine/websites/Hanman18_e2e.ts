import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hanman18',
        title: 'Hanman18'
    },
    container: {
        url: 'https://hanman18.com/manhwa/jiazhengfuxiaojiejie',
        id: '/manhwa/jiazhengfuxiaojiejie',
        title: '家政婦小姐姐'
    },
    child: {
        id: '/manhwa/jiazhengfuxiaojiejie/50',
        title: '第50話-少爺，我不能沒有你'
    },
    entry: {
        index: 0,
        size: 657_555,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());