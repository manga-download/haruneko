import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'fbsquads',
        title: 'Fleur Blanche Squads'
    },
    container: {
        url: 'https://fbsquadx.com/manga/polar-attraction/',
        id: JSON.stringify({ slug: '/manga/polar-attraction/' }),
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

new TestFixture(config).AssertWebsite();