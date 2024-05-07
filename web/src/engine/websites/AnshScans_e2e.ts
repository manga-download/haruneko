import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'anshscans',
        title: 'Ansh Scans'
    },
    container: {
        url: 'https://anshscans.org/comic/eternal-god-emperor/',
        id: JSON.stringify({ post: '140', slug: '/comic/eternal-god-emperor/' }),
        title: 'Eternal God Emperor'
    },
    child: {
        id: '/comic/eternal-god-emperor/chapter-0/',
        title: 'chapter 0'
    },
    entry: {
        index: 0,
        size: 2_142_912,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());