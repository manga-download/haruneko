import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'sinensisscan',
        title: 'Sinensis Scans',
        timeout: 35000, //warning : WEBSITE IS SLOW IN BROWSER
    },
    container: {
        url: 'https://sinensisscan.net/manga/a-budgies-life/',
        id: JSON.stringify({ post: '9436', slug: '/manga/a-budgies-life/' }),
        title: 'A vida de um passarinho',
    },
    child: {
        id: '/manga/a-budgies-life/cap-01/',
        title: 'Cap. 01',
        timeout: 15000

    },
    entry: {
        index: 0,
        size: 514_538,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());