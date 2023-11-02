import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
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
        id: '/lel/read/a-trail-of-blood/en-us/0/99/',
        title: 'Chapter 99: Visitors'
    },
    entry: {
        index: 0,
        size: 281_073,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());