import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangacultivator',
        title: 'MangaCultivator'
    },
    container: {
        url: 'https://mangacult.org/manga/lightnings-dfs/',
        id: JSON.stringify({ post: '1307', slug: '/manga/lightnings-dfs/' }),
        title: 'Lightning Degree'
    },
    child: {
        id: '/manga/lightnings-dfs/ch-001/',
        title: 'Ch.001',
        timeout: 15000
    },
    entry: {
        index: 0,
        size: 163_204,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());