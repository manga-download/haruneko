import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'seraphmanga',
        title: 'Seraph Manga'
    },
    container: {
        url: 'https://www.seraphmanga.com/manga/ben-regresor-degilim/',
        id: '/manga/ben-regresor-degilim/',
        title: 'Ben Regresör Değilim'
    },
    child: {
        id: '/ben-regresor-degilim-24-bolum/',
        title: 'Bölüm 24'
    },
    entry: {
        index: 9,
        size: 976_038,
        type: 'image/png'
    }
}).AssertWebsite();