import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'ikifeng',
        title: 'Ikifeng'
    },
    container: {
        url: 'https://ikifeng.com/manga/aporia/',
        id: JSON.stringify({ post: '2189', slug: '/manga/aporia/' }),
        title: 'Aporia'
    },
    child: {
        id: '/manga/aporia/capitulo-0/',
        title: 'Capitulo 0'
    },
    entry: {
        index: 0,
        size: 333_677,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());