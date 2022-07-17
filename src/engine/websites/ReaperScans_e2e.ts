import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'reaperscans',
        title: 'Reaper Scans'
    },
    container: {
        url: 'https://reaperscans.com/series/transcension-academy/',
        id: JSON.stringify({ post: '61618', slug: '/series/transcension-academy/' }),
        title: 'Transcension Academy'
    },
    child: {
        id: '/series/transcension-academy/chapter-0/',
        title: 'Chapter 0'
    },
    entry: {
        index: 0,
        size: 274_520,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());