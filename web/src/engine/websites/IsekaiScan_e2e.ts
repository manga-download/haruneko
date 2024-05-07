import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'isekaiscan',
        title: 'Isekai Scan'
    },
    container: {
        url: 'https://m.isekaiscan.to/mangax/magic-emperor-43/',
        id: JSON.stringify({ post: '2282', slug: '/mangax/magic-emperor-43/' }),
        title: 'Magic Emperor'
    },
    child: {
        id: '/mangax/magic-emperor-43/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 47_882,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());