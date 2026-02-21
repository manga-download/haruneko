import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'apkomik',
        title: 'APKomik'
    },
    container: {
        url: 'https://apkomik.cc/manga/a-bad-person/',
        id: '/manga/a-bad-person/',
        title: 'A Bad Person (Bad Guy)'
    },
    child: {
        id: '/a-bad-person-chapter-01-bahasa-indonesia/',
        title: 'Chapter 01'
    },
    entry: {
        index: 1,
        size: 172_827,
        type: 'image/jpeg'
    }
}).AssertWebsite();