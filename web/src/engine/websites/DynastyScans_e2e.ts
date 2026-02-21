import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'dynasty-scans',
        title: 'Dynasty Reader'
    },
    container: {
        url: 'https://dynasty-scans.com/series/175160',
        id: '/series/175160',
        title: '#175160#'
    },
    child: {
        id: '/chapters/175160_ch01_1',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 1_183_399,
        type: 'image/png'
    }
}).AssertWebsite();