import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'fdmscan',
        title: 'Fdm scan'
    },
    container: {
        url: 'https://fdmscan.com/manga/machspeed-starscars/',
        id: JSON.stringify({ post: '1925', slug: '/manga/machspeed-starscars/' }),
        title: 'Machspeed Starscars'
    },
    child: {
        id: '/manga/machspeed-starscars/capitulo-1/',
        title: 'Capítulo 1'
    },
    entry: {
        index: 0,
        size: 562_724,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());