import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'dynasty-scans',
        title: 'DynastyScans'
    },
    container: {
        url: 'https://dynasty-scans.com/series/175160', //One Piece
        id: '/series/175160',
        title: '#175160#'
    },
    child: {
        id: '/chapters/175160_ch01_1',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 1_183_399,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());