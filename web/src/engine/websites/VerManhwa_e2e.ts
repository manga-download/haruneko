import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'vermanhwa',
        title: 'VerManhwa'
    },
    container: {
        url: 'https://vermanhwa.com/manga/deja-que-te-ensene/',
        id: JSON.stringify({ post: '2670', slug: '/manga/deja-que-te-ensene/' }),
        title: 'Deja que te enseñe'
    },
    child: {
        id: '/manga/deja-que-te-ensene/capitulo-47/',
        title: 'Capitulo 47'
    },
    entry: {
        index: 0,
        size: 97_745,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());