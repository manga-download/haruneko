import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'fbsquads',
        title: 'Fleur Blanche Squads'
    },
    container: {
        url: 'https://fbsquads.com/manga/polar-attraction/',
        id: JSON.stringify({ post: '5169', slug: '/manga/polar-attraction/' }),
        title: 'Polar Attraction',
    },
    child: {
        id: '/manga/polar-attraction/capitulo-1/',
        title: 'Capítulo 1'
    },
    entry: {
        index: 2,
        size: 417_842,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());