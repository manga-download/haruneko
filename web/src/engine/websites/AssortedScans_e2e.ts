import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'assortedscans',
        title: 'Assorted Scans'
    },
    container: {
        url: 'https://assortedscans.com/reader/the-illidan-girl/',
        id: '/reader/the-illidan-girl/',
        title: 'The Illidan Girl'
    },
    child: {
        id: '/reader/the-illidan-girl/0/1/',
        title: 'Ch. 1'
    },
    entry: {
        index: 0,
        size: 559_983,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());