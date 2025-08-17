import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'sektekomik',
        title: 'SEKTEKOMIK.XYZ'
    },
    container: {
        url: 'https://sektekomik.id/manga/existence',
        id: '/manga/existence',
        title: 'Existence'
    },
    child: {
        id: '/manga/existence/ch/62',
        title: 'Ch 62'
    },
    entry: {
        index: 1,
        size: 526_546,
        type: 'image/jpeg'
    }
}).AssertWebsite();