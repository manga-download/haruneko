import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'yakshascans',
        title: 'YakshaScans'
    },
    container: {
        url: 'https://yakshascans.com/manga/454/',
        id: JSON.stringify({ post: '454', slug: '/manga/454/' }),
        title: 'I have 90 billion licking gold coins'
    },
    child: {
        id: '/manga/454/chapter-225/',
        title: 'Chapter 225'
    },
    entry: {
        index: 1,
        size: 1_972_248,
        type: 'image/jpeg',
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());