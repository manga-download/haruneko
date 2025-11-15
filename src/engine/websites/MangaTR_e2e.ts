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
        title: '100'
    },
    entry: {
        index: 2,
        size: 265_812,
        type: 'image/webp'
    }
}).AssertWebsite();