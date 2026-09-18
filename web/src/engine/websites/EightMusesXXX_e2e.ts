import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture( {
    plugin: {
        id: '8musesxxx',
        title: '8 MUSES XXX'
    },
    container: {
        url: 'https://8muses.xxx/comics/hirama-hirokazu/',
        id: '/comics/hirama-hirokazu/',
        title: 'Hirama Hirokazu'
    },
    child: {
        id: '/comics/hirama-hirokazu/issue-1/read/',
        title: 'Issue 1'
    },
    entry: {
        index: 0,
        size: 823_794,
        type: 'image/jpeg'
    }
}).AssertWebsite();