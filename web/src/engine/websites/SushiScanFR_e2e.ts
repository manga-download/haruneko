import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'sushiscanfr',
        title: 'Sushi Scans (FR)'
    },
    container: {
        url: 'https://sushiscan.fr/manga/sakamoto-days/',
        id: '/manga/sakamoto-days/',
        title: 'Sakamoto Days'
    },
    child: {
        id: '/sakamoto-days-chapitre-136/',
        title: 'Chapitre 136'
    },
    entry: {
        index: 0,
        size: 333_194,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());