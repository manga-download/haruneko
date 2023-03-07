import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangasail',
        title: 'MangaSail',
    },
    container: {
        url: 'https://www.mangasail.net/content/seoul-station-necromancer',
        id: '/content/seoul-station-necromancer',
        title: 'Seoul Station Necromancer'
    },
    child: {
        id: '/content/seoul-station-necromancer-82?page=all',
        title: '82',
        timeout: 20_000,

    },
    entry: {
        index: 0,
        size: 2_574_078,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());