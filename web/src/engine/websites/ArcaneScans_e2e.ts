import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'arcanescans',
        title: 'ArcaneScans'
    },
    container: {
        url: 'https://arcanescans.com/manga/serving-the-heavens-is-my-destiny/',
        id: JSON.stringify({ post: '2503', slug: '/manga/serving-the-heavens-is-my-destiny/'}),
        title: 'Serving the Heavens is my Destiny'
    },
    child: {
        id: '/manga/serving-the-heavens-is-my-destiny/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 3_039_876,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());