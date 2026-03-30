import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'xomanga',
        title: 'XoManga',
    },
    container: {
        url: 'https://xomanga.blogspot.com/2026/02/kuro-no-shoukanshi.html',
        id: '/2026/02/kuro-no-shoukanshi.html',
        title: 'Kuro no Shoukanshi',
    },
    child: {
        id: '/2026/02/kuro-no-shoukanshi-chapter-185.html',
        title: 'Chapter 185'
    },
    entry: {
        index: 0,
        size: 735_586,
        type: 'image/jpeg'
    }
}).AssertWebsite();