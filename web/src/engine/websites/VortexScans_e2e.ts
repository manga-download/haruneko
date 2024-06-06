import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'vortexscans',
        title: 'Vortex Scans'
    },
    container: {
        url: 'https://vortexscans.org/series/regenerate-top-players',
        id: JSON.stringify({ id: '8', slug: 'regenerate-top-players'}),
        title: 'Regenerate Top Players'
    },
    child: {
        id: '/series/regenerate-top-players/chapter-5',
        title: '5 Crushing Desperation'
    },
    entry: {
        index: 0,
        size: 1_167_128,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());