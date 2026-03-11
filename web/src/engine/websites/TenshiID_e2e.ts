import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'tenshiid',
        title: 'Tenshi.ID'
    },
    container: {
        url: 'https://01.tenshiku.asia/komik/a-bad-person/',
        id: '/komik/a-bad-person/',
        title: 'A Bad Person'
    },
    child: {
        id: '/a-bad-person-chapter-01-bahasa-indonesia/',
        title: 'Chapter 01',
        timeout: 15000
    },
    entry: {
        index: 1,
        size: 172_827,
        type: 'image/jpeg'
    }
}).AssertWebsite();