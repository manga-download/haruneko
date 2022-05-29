import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'apolltoons',
        title: 'Apolltoons'
    },
    container: {
        url: 'https://apolltoons.xyz/manga/aqua/',
        id: JSON.stringify({ post: '961', slug: '/manga/aqua/' }),
        title: 'Aqua'
    },
    child: {
        id: '/manga/aqua/capitulo-1/',
        title: 'Capitulo 1'
    },
    entry: {
        index: 0,
        size: 15_696,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());