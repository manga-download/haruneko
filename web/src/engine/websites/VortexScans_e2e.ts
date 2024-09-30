import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'vortexscans',
        title: 'Vortex Scans'
    },
    container: {
        url: 'https://vortexscans.com/series/regenerate-top-players-0cn52tcd',
        id: JSON.stringify({ slug: 'regenerate-top-players-0cn52tcd', id: '8'}),
        title: 'Regenerate Top Players'
    },
    child: {
        id: '/series/regenerate-top-players-0cn52tcd/chapter-5-6tp05ofz',
        title: '5 : Crushing Desperation'
    },
    entry: {
        index: 0,
        size: 1_167_128,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());