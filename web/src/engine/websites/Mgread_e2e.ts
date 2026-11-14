import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mgread',
        title: 'Mgread'
    },
    container: {
        url: 'https://mgread.io/manga/my-eternal-reign/',
        id: '/manga/my-eternal-reign/',
        title: 'My Eternal Reign'
    },
    child: {
        id: '/manga/my-eternal-reign/chapter-9/',
        title: 'Chapter 9'
    },
    entry: {
        index: 1,
        size: 415_807,
        type: 'image/jpeg'
    }
}).AssertWebsite();
