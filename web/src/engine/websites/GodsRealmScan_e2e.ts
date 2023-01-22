import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'godsrealmscan',
        title: `God's Realm Scan`
    },
    container: {
        url: 'https://godsrealmscan.com/manga/vecino-vampiro/',
        id: JSON.stringify({ post: '2247', slug: '/manga/vecino-vampiro/' }),
        title: 'Vecino vampiro'
    },
    child: {
        id: '/manga/vecino-vampiro/capitulo-1/',
        title: 'Capítulo 1'
    },
    entry: {
        index: 1,
        size: 545_054,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());