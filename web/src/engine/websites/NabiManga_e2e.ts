import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'nabimanga',
        title: 'NabiManga'
    },
    container: {
        url: 'https://www.nabicix.com/manga/akademinin-tilki-gozlu-seytani/',
        id: '/manga/akademinin-tilki-gozlu-seytani/',
        title: 'Akademinin Tilki Gözlü Şeytanı'
    },
    child: {
        id: '/akademinin-tilki-gozlu-seytani-bolum-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 0,
        size: 788_006,
        type: 'image/webp'
    }
}).AssertWebsite();