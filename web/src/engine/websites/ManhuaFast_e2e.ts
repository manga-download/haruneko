import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhuafast',
        title: 'Manhuafast'
    },
    container: {
        url: 'https://manhuafast.com/manga/one-sword-reigns-supreme/',
        id: JSON.stringify({ post: '52679', slug: '/manga/one-sword-reigns-supreme/' }),
        title: 'One Sword Reigns Supreme'
    },
    child: {
        id: '/manga/one-sword-reigns-supreme/chapter-200/',
        title: 'Chapter 200'
    },
    entry: {
        index: 0,
        size: 413_000,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());