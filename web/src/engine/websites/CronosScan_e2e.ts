import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'cronosscan',
        title: 'Cronos Scan'
    },
    container: {
        url: 'https://cronosscan.net/manga/apocalyptic-thief/',
        id: JSON.stringify({ post: '1844', slug: '/manga/apocalyptic-thief/' }),
        title: 'Apocalyptic Thief'
    },
    child: {
        id: '/manga/apocalyptic-thief/capitulo-00/',
        title: 'Capítulo 00'
    },
    entry: {
        index: 0,
        size: 191_962,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());