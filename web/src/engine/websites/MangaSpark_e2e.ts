import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangaspark',
        title: 'مانجا سبارك (MangaSpark)'
    },
    container: {
        url: 'https://mangaspark.com/manga/the-unlikely-gods/',
        id: JSON.stringify({ post: '83566', slug: '/manga/the-unlikely-gods/' }),
        title: 'The Unlikely Gods'
    },
    child: {
        id: '/manga/the-unlikely-gods/1/',
        title: '1'
    },
    entry: {
        index: 0,
        size: 260_405,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());