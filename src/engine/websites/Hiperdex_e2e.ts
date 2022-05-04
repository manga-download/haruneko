import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hiperdex',
        title: 'Hiperdex'
    },
    // CloudFlare challenge... cannot be bypassed yet with puppeteer
    /*
    container: {
        url: 'https://hiperdex.com/manga/b-chiku/',
        id: JSON.stringify({ post: '2529', slug: '/manga/b-chiku/' }),
        title: 'B-Chiku'
    },
    child: {
        id: '/manga/b-chiku/07-end/',
        title: '_07 [END]'
    },
    entry: {
        index: 0,
        size: -1,
        type: 'image/jpeg'
    }
    */
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());