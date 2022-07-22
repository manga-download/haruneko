import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hentaizone',
        title: 'HentaiZone'
    },
    container: {
        url: 'https://hentaizone.xyz/manga/new-town/',
        id: JSON.stringify({ post: '1801', slug: '/manga/new-town/' }),
        title: 'New Town'
    },
    child: {
        id: '/manga/new-town/chapitre-1/',
        title: 'Chapitre 1'
    },
    entry: {
        index: 0,
        size: 501_787,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());