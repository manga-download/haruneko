import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'asurascans-tr',
        title: 'Asura Scans (TR)',
        timeout: 30000
    },
    container: {
        url: 'https://armoniscans.com/manga/kuduz-hancerin-intikami/',
        id: '/manga/kuduz-hancerin-intikami/',
        title: 'Kuduz Hançerin İntikamı',
    },
    child: {
        id: '/kuduz-hancerin-intikami-bolum-1/',
        title: 'Bölüm 1',
        timeout: 25000
    },
    entry: {
        index: 1,
        size: 3_983_216,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());