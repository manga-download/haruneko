import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangatr',
        title: 'Manga-TR'
    },
    container: {
        url: 'https://manga-tr.com/manga-mairimashita-iruma-kun.html',
        id: '/manga-mairimashita-iruma-kun.html',
        title: 'Mairimashita! Iruma-kun',
        timeout: 15_000
    },
    child: {
        id: '/id-127778-read-mairimashita-iruma-kun-chapter-100.html',
        title: '100.Bölüm',
        timeout: 15_000
    }, // They are using cloudflare to block page downloading, pray that you are not flagged
    entry: {
        index: 2,
        size: 1_024_749,
        type: 'image/png'
    }
}).AssertWebsite();