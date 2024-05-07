import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'bokugents',
        title: 'Bokugen Translation'
    },
    container: {
        url: 'https://bokugents.com/manga/yumemiru/',
        id: JSON.stringify({ post: '2956', slug: '/manga/yumemiru/' }),
        title: 'Yumemiru Danshi wa Genjitsushugisha'
    },
    child: {
        id: '/manga/yumemiru/cap-31-1/',
        title: 'Cap 31.1'
    },
    entry: {
        index: 0,
        size: 462_648,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());