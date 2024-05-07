import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'dragontea',
        title: 'Dragon Tea Scans'
    },
    container: {
        url: 'https://dragontea.ink/novel/strongest-tamer/',
        id: JSON.stringify({ post: '3756', slug: '/novel/strongest-tamer/' }),
        title: 'Strongest Tamer'
    },
    child: {
        id: '/novel/strongest-tamer/chapter-0/',
        title: 'chapter 0'
    },
    entry: {
        index: 0,
        size: 92_087,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());