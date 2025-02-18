import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangaupjapan',
        title: 'MangaUp (マンガアップ!)'
    },
    container: {
        url: 'https://www.manga-up.com/titles/214',
        id: '214',
        title: '咲-阿知賀編-'
    },
    child: {
        id: '39175',
        title: '第１局 邂逅 - ①'
    },
    entry: {
        index: 0,
        size: 61_018,
        type: 'image/webp'
    }
}).AssertWebsite();
