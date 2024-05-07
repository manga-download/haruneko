import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'milftoon',
        title: 'Milftoon Comics'
    },
    container: {
        url: 'https://milftoon.xxx/comics/thankstaking/',
        id: JSON.stringify({ post: '786', slug: '/comics/thankstaking/' }),
        title: 'Thankstaking'
    },
    child: {
        id: '/comics/thankstaking/issue-1/',
        title: 'Issue 1'
    },
    entry: {
        index: 0,
        size: 197_651,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());