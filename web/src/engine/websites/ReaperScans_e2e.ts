import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'reaperscans',
        title: 'Reaper Scans'
    },
    container: {
        url: 'https://reaperscans.com/series/990k-ex-life-hunter',
        id: '49',
        title: '990k Ex-Life Hunter',
        timeout: 15000
    },
    child: {
        id: '/series/990k-ex-life-hunter/chapter-74',
        title: 'Chapter 74',
        timeout: 10000

    },
    entry: {
        index: 0,
        size: 432_585,
        type: 'image/jpeg'
    }
}).AssertWebsite();