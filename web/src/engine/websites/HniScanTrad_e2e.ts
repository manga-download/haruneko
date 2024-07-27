import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'hniscantrad',
        title: 'HNI-Scantrad'
    },
    container: {
        url: 'https://hni-scantrad.net/comics/major',
        id: 'major',
        title: 'Major'
    },
    child: {
        id: '/read/major/fr/vol/55/ch/517',
        title: 'Tome 55 - Homerun 517 : Gyrofronde'
    },
    entry: {
        index: 1,
        size: 851_052,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());