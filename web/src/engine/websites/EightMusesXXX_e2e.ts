import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: '8musesxxx',
        title: '8 MUSES XXX'
    },
    container: {
        url: 'https://8muses.xxx/comics/hirama-hirokazu/',
        id: '/comics/hirama-hirokazu/',
        title: 'Hirama Hirokazu'
    },
    child: {
        id: '/comics/hirama-hirokazu/issue-1',
        title: 'Issue 1'
    },
    entry: {
        index: 0,
        size: 823_794,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());