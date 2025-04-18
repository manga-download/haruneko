import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'monzeekomik',
        title: 'MonzeeKomik'
    },
    container: {
        url: 'https://monzeekomik.my.id/manga/i-have-90-billion-licking-gold-bahasa-indonesia/',
        id: '/manga/i-have-90-billion-licking-gold-bahasa-indonesia/',
        title: 'I Have 90 Billion Licking Gold'
    },
    child: {
        id: '/i-have-90-billion-licking-gold-chapter-179-bahasa-indonesia/',
        title: 'Chapter 179'
    },
    entry: {
        index: 0,
        size: 175_503,
        type: 'image/jpeg'
    }
}).AssertWebsite();