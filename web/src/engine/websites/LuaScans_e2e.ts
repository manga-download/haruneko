import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'luascans',
        title: 'Lua Scans'
    },
    container: {
        url: 'https://luascans.com/manga/lady-baby/',
        id: '/manga/lady-baby/',
        title: 'Lady Baby'
    },
    child: {
        id: '/lady-baby-chapter-213/',
        title: 'Chapter 213'
    },
    entry: {
        index: 0,
        size: 1_082_444,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());