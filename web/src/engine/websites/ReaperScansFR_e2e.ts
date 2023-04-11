import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'reaperscansfr',
        title: 'Reaper Scans (French)'
    },
    container: {
        url: 'https://reaperscans.fr/serie/perfect-surgeon/',
        id: '{"post":"212","slug":"/serie/perfect-surgeon/"}',
        title: 'Perfect Surgeon'
    },
    child: {
        id: '/serie/perfect-surgeon/chapitre-46/',
        title: 'Chapitre 46'
    },
    entry: {
        index: 2,
        size: 1_809_163,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());