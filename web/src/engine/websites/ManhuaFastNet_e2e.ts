import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhuafastnet',
        title: 'Manhuafast(.net)'
    },
    container: {
        url: 'https://manhuafast.net/manga/the-executioner/',
        id: JSON.stringify({ post: '3212', slug: '/manga/the-executioner/' }),
        title: 'The Executioner'
    },
    child: {
        id: '/manga/the-executioner/chapter-11/',
        title: 'Chapter 11'
    },
    entry: {
        index: 1,
        size: 258_090,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());