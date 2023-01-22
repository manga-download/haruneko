import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'leviatanscans',
        title: 'LeviatanScans'
    },
    container: {
        url: 'https://leviatanscans.com/hy/manga/my-dad-is-too-strong/',
        id: JSON.stringify({ post: '24', slug: '/hy/manga/my-dad-is-too-strong/' }),
        title: 'My Dad is Too Strong'
    },
    child: {
        id: '/hy/manga/my-dad-is-too-strong/01/',
        title: '01'
    },
    entry: {
        index: 0,
        size: 708_019,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());