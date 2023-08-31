import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'randomscan',
        title: 'Random Scans'
    },
    container: {
        url: 'https://randomscans.com/manga/inthenight8/',
        id: JSON.stringify({ post: '73', slug: '/manga/inthenight8/' }),
        title: 'In The Night Consumed By Blades, I Walk'
    },
    child: {
        id: '/manga/inthenight8/cap-01/',
        title: 'Cap. 01'
    },
    entry: {
        index: 1,
        size: 574_291,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());