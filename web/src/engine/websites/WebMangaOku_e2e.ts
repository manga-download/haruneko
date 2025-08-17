import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'webmangaoku',
        title: 'WebMangaOku'
    },
    container: {
        url: 'https://webmangaoku.com/manga/4000-yilin-ardindan-donen-kadim-buyucu/',
        id: '/manga/4000-yilin-ardindan-donen-kadim-buyucu/',
        title: '4000 Yılın Ardından Dönen Kadim Büyücü'
    },
    child: {
        id: '/4000-yilin-ardindan-donen-kadim-buyucu-bolum-209/',
        title: 'Bölüm 209'
    },
    entry: {
        index: 0,
        size: 70_002,
        type: 'image/webp'
    }
}).AssertWebsite();