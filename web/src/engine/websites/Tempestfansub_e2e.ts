import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'tempestfansub',
        title: 'Tempestfansub'
    },
    container: {
        url: 'https://tempestfansub.com/manga/chainsaw-man/',
        id: '/manga/chainsaw-man/',
        title: 'Chainsaw Man'
    },
    child: {
        id: '/chainsaw-man-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 1,
        size: 289_310,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());