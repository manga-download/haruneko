import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'writersscans',
        title: `Writers' Scans`
    },
    container: {
        url: 'https://writerscans.com/series/642959ae0e7/',
        id: '/series/642959ae0e7/',
        title: 'Eating Me Is Not Allowed!'
    },
    child: {
        id: '/chapter/642959ae0e7-64295d3d7ce/',
        title: 'Chapter 1'
    },
    entry: {
        index: 4,
        size: 562_663,
        type: 'image/png'
    }
}).AssertWebsite();