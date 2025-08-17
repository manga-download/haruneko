import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'rezoscans',
        title: 'Rezo Scans'
    },
    container: {
        url: 'https://rezoscans.com/series/6285e0e319d/',
        id: '/series/6285e0e319d/',
        title: 'I Can Raise Skeletons'
    },
    child: {
        id: '/chapter/6285e0e319d-62a69ec7ae7/',
        title: 'Chapter 24'
    },
    entry: {
        index: 1,
        size: 897_573,
        type: 'image/jpeg'
    }
}).AssertWebsite();