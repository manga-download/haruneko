import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'vortexscans',
        title: 'Vortex Scans'
    },
    container: {
        url: 'https://vortexscans.com/series/regenerate-top-players',
        id: JSON.stringify({ id: "8", slug: 'regenerate-top-players'}),
        title: 'Regenerate Top Players'
    },
    child: {
        id: 'chapter-5',
        title: '5 Crushing Desperation'
    },
    entry: {
        index: 0,
        size: 1_167_128,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());