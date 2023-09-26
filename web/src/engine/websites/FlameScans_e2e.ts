import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'flamescans-org',
        title: 'Flame Scans'
    },
    container: {
        url: 'https://flamescans.org/series/1695463322-solo-necromancy/',
        id: '/series/1695463322-solo-necromancy/',
        title: 'Solo Necromancy'
    },
    child: {
        id: '/1695463262-solo-necromancy-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 3_653_029,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());