import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'nabimanga',
        title: 'NabiManga'
    },
    container: {
        url: 'https://nabimanga.com/manga/akademinin-onur-ogrencisi/',
        id: '/manga/akademinin-onur-ogrencisi/',
        title: 'Akademinin Onur Öğrencisi'
    },
    child: {
        id: '/akademinin-onur-ogrencisi-bolum-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 3,
        size: 934_760,
        type: 'image/webp'
    }
}).AssertWebsite();