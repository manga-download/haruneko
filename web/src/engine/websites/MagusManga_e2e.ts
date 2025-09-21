import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'magusmanga',
        title: 'MagusManga'
    },
    container: {
        url: 'https://magustoon.org/series/the-merman-trapped-in-my-lake',
        id: '206',
        title: 'The Merman Trapped in My Lake'
    },
    child: {
        id: '/series/the-merman-trapped-in-my-lake/chapter-1',
        title: 'Chapter 1 - Chapter 1'
    },
    entry: {
        index: 12,
        size: 156_884,
        type: 'image/jpeg'
    }
}).AssertWebsite();