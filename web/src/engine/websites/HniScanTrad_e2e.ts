import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hniscantrad',
        title: 'HNI-Scantrad'
    },
    container: {
        url: 'https://hni-scantrad.com/lel/series/a-trail-of-blood/',
        id: '/lel/series/a-trail-of-blood/',
        title: 'A Trail of Blood'
    },
    child: {
        id: '/lel/read/a-trail-of-blood/fr/0/96/',
        title: 'Chapter 96: Confirmation'
    },
    entry: {
        index: 0,
        size: 417_539,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());