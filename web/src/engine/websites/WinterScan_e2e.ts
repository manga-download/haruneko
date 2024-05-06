import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'winterscan',
        title: 'Winter Scan'
    },
    container: {
        url: 'https://winterscan.com/manga/day-by-day/',
        id: JSON.stringify({ post: '2430', slug: '/manga/day-by-day/' }),
        title: 'Day by Day'
    },
    child: {
        id: '/manga/day-by-day/capitulo-01/',
        title: 'Capítulo 01'
    },
    entry: {
        index: 0,
        size: 91_562,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());