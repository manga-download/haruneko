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
        id: '175331',
        title: '第３５局 心行（後編）'
    },
    entry: {
        index: 0,
        size: 152_838,
        type: 'image/webp'
    }
}).AssertWebsite();
