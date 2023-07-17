import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'asurascans-tr',
        title: 'Asura Scans (TR)',
    },
    container: {
        url: 'https://asurascanstr.com/manga/kuduz-hancerin-intikami/',
        id: '/manga/kuduz-hancerin-intikami/',
        title: 'Kuduz Hançerin İntikamı',
    },
    child: {
        id: '/kuduz-hancerin-intikami-bolum-1/',
        title: 'Bölüm 1',
    },
    entry: {
        index: 1,
        size: 3_309_983,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());