import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangatr',
        title: 'Manga-TR'
    },
    container: {
        url: 'https://manga-tr.com/manga-mairimashita-iruma-kun.html',
        id: '/manga-mairimashita-iruma-kun.html',
        title: 'Mairimashita! Iruma-kun'
    },
    child: {
        id: '/id-127778-read-mairimashita-iruma-kun-chapter-100.html',
        title: '100. Bölüm'
    },
    entry: {
        index: 2,
        size: 1_042_525,
        type: 'image/png'
    }
}).AssertWebsite();