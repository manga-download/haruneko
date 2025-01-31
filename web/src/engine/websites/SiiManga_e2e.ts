import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'siimanga',
        title: 'SiiManga'
    },
    container: {
        url: 'https://siikomik.art/manga/i-have-90-billion-licking-gold/',
        id: '/manga/i-have-90-billion-licking-gold/',
        title: 'I Have 90 Billion Licking Gold',
        timeout: 10000
    },
    child: {
        id: '/i-have-90-billion-licking-gold-chapter-365/',
        title: 'Chapter 365',
    },
    entry: {
        index: 1,
        size: 268_110,
        type: 'image/jpeg',
    }
}).AssertWebsite();