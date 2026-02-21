import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'uzaymanga',
        title: 'Uzay Manga'
    },
    container: {
        url: 'https://uzaymanga.com/manga/51/olumsuzun-geri-donusu',
        id: '/manga/51/olumsuzun-geri-donusu',
        title: 'Ölümsüzün Geri Dönüşü'
    },
    child: {
        id: '/manga/51/olumsuzun-geri-donusu/2964/127-bolum',
        title: 'Bölüm 127'
    },
    entry: {
        index: 1,
        size: 788_007,
        type: 'image/jpeg'
    }
}).AssertWebsite();