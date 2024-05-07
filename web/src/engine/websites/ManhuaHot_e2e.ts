import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhuahot',
        title: 'ManhuaHot'
    },
    container: {
        url: 'https://manhuahot.com/manga/kiss-the-abyss/',
        id: JSON.stringify({ post: '5011', slug: '/manga/kiss-the-abyss/' }),
        title: 'Kiss The Abyss'
    },
    child: {
        id: '/manga/kiss-the-abyss/chap-0/',
        title: 'Chap 0'
    },
    entry: {
        index: 0,
        size: 441_577,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());