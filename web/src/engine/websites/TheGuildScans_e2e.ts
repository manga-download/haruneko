import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'theguildscans',
        title: 'The Guild Scans'
    },
    container: {
        url: 'https://theguildscans.com/manga/castle-2-pinnacle/',
        id: JSON.stringify({ post: '2149', slug: '/manga/castle-2-pinnacle/' }),
        title: 'Castle 2: Pinnacle'
    },
    child: {
        id: '/manga/castle-2-pinnacle/prologue/',
        title: 'Prologue'
    },
    entry: {
        index: 0,
        size: 3_305_927,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());