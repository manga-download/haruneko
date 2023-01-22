import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'asurascans-tr',
        title: 'Asura Scans (TR)'
    },
    container: {
        url: 'https://asurascanstr.com/manga/leveling-with-the-gods/',
        id: '/manga/leveling-with-the-gods/',
        title: 'Leveling With The Gods'
    },
    child: {
        id: '/leveling-with-the-gods-bolum-1/',
        title: 'Bölüm 1 - Kaybettik'
    },
    entry: {
        index: 0,
        size: 424_905,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());