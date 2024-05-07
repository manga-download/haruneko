import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'fbsquads',
        title: 'Fleur Blanche Squads'
    },
    container: {
        url: 'https://fbsscan.com/manga/polar-attraction/',
        id: JSON.stringify({ slug: '/manga/polar-attraction/' }),
        title: 'Polar Attraction',
    },
    child: {
        id: '/manga/polar-attraction/capitulo-1/',
        title: 'Capítulo 1'
    },
    entry: {
        index: 2,
        size: 353_179,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());