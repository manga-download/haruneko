import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'madarascans',
        title: 'Madara Scans'
    },
    container: {
        url: 'https://madarascans.com/series/accident-handling-department-new-recruit/',
        id: '/series/accident-handling-department-new-recruit/',
        title: 'Accident handling department new recruit'
    },
    child: {
        id: '/accident-handling-department-new-recruit-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 681_266,
        type: 'image/webp'
    }
}).AssertWebsite();