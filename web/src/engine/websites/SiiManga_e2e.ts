import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'siimanga',
        title: 'SiiManga'
    },
    container: {
        url: 'https://web.siikomik.org/manga/i-have-90-billion-licking-gold/',
        id: '/manga/i-have-90-billion-licking-gold/',
        title: 'I Have 90 Billion Licking Gold'
    },
    child: {
        id: '/i-have-90-billion-licking-gold-chapter-365/',
        title: 'Chapter 365'
    },
    entry: {
        index: 2,
        size: 150_237,
        type: 'image/jpeg'
    }
}).AssertWebsite();