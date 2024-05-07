import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'dessertscan',
        title: 'Dessert Scan'
    },
    container: {
        url: 'https://cabaredowatame.site/manga/2gether-the-series/',
        id: JSON.stringify({ post: '216', slug: '/manga/2gether-the-series/' }),
        title: '2Gether: The Series'
    },
    child: {
        id: '/manga/2gether-the-series/capitulo-34/',
        title: 'Capítulo 34'
    },
    entry: {
        index: 1,
        size: 1_906_419,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());