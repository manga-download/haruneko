import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'bananascan',
        title: 'Banana Scan'
    },
    container: {
        url: 'https://banana-scan.com/manga/young-boss/',
        id: '/manga/young-boss/',
        title: 'Young Boss'
    },
    child: {
        id: '/young-boss-chapitre-1/',
        title: 'Chapitre 1'
    },
    entry: {
        index: 1,
        size: 615_104,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());