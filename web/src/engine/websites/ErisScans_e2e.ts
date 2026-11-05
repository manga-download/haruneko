import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'erisscans',
        title: 'Eris Scans'
    },
    container: {
        url: 'https://erisscans.com/series/65c7c16e282/',
        id: '/series/65c7c16e282/',
        title: 'Love Junkie'
    },
    child: {
        id: '/chapter/65c7c16e282-65c7c2330d3/',
        title: 'Chapter 50',
        timeout: 15_000
    },
    entry: {
        index: 0,
        size: 289_880,
        type: 'image/avif'
    }
}).AssertWebsite();