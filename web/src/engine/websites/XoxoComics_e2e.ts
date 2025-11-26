import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture( {
    plugin: {
        id: 'xoxocomics',
        title: 'XoxoComics'
    },
    container: {
        url: 'https://xoxocomic.com/comic/the-amazing-spider-man-2015',
        id: '/comic/the-amazing-spider-man-2015',
        title: 'The Amazing Spider-Man (2015)'
    },
    child: {
        id: '/comic/the-amazing-spider-man-2015/issue-1/all',
        title: 'Issue #1'
    },
    entry: {
        index: 2,
        size: 1_755_681,
        type: 'image/jpeg'
    }
}).AssertWebsite();