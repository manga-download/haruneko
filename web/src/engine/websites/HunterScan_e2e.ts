import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hunterscan',
        title: 'Hunters Scan'
    },
    container: {
        url: 'https://huntersscan.xyz/manga/civilizacao-de-nebula',
        id: '9b3be276-e31e-4e85-8f70-085e96661b80',
        title: 'Civilização de Nebula'
    },
    child: {
        id: '9b69a878-c2b5-4523-983d-43c716cae509',
        title: '20'
    },
    entry: {
        index: 0,
        size: 606_110,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());