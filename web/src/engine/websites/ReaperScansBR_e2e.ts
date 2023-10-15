import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'reaperscansbr',
        title: 'Reaper Scans (Portuguese)',
        timeout: 35000, //website takes around this time to load in real browser o_o
    },
    container: {
        url: 'https://reaperscans.net/series/max-level-player-1679526000038',
        id: '/series/max-level-player-1679526000038',
        title: 'Max Level Player'
    },
    child: {
        id: '/series/max-level-player-1679526000038/capitulo-10',
        title: 'Capítulo 10',
        timeout: 20000
    },
    entry: {
        index: 1,
        size: 1_536_165,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());