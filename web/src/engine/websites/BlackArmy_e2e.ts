import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'blackarmy',
        title: 'Black Army'
    },
    container: {
        url: 'https://blackarmy.fr/manga/ex-and-ash/',
        id: '/manga/ex-and-ash/',
        title: 'Ex and Ash'
    },
    child: {
        id: '/ex-and-ash-01/',
        title: 'Chapitre 01'
    },
    entry: {
        index: 1,
        size: 2_583_611,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());