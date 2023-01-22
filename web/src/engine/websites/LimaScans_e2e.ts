import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config : Config = {
    plugin: {
        id: 'limascans',
        title: 'Lima Scans'
    },
    container: {
        url: 'http://limascans.xyz/v2/manga/meikyuu-black-company/',
        id: JSON.stringify({ post: '83', slug: '/v2/manga/meikyuu-black-company/' }),
        title: 'Meikyuu Black Company'
    },
    child: {
        id: '/v2/manga/meikyuu-black-company/capitulo-01/',
        title: 'Capítulo 01'
    },
    entry: {
        index: 1,
        size: 1_633_426,
        type: 'image/jpeg',
        timeout: 15_000
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());