import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'korelimanga',
        title: 'KoreliManga'
    },
    container: {
        url: 'https://korelimanga.com/manga/buyuk-savas/',
        id: '/manga/buyuk-savas/',
        title: 'Büyük Savaş'
    },
    child: {
        id: '/manga/buyuk-savas/chapter-60/',
        title: 'Bölüm 60'
    },
    entry: {
        index: 1,
        size: 660_264,
        type: 'image/webp'
    }
}).AssertWebsite();