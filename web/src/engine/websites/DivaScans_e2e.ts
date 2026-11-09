import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'divascans',
        title: 'Diva Scans'
    },
    container: {
        url: 'https://divascans.org/series/comic/caregiving-alliance',
        id: '/series/comic/caregiving-alliance',
        title: 'Caregiving Alliance'
    },
    child: {
        id: '/series/comic/caregiving-alliance/chapter/1',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 193_546,
        type: 'image/webp'
    }
}).AssertWebsite();