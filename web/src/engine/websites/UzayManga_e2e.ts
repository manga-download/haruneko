import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'uzaymanga',
        title: 'Uzay Manga'
    },
    container: {
        url: 'https://uzaymanga.com/manga/olumsuzun-geri-donusu',
        id: 'olumsuzun-geri-donusu',
        title: 'Ölümsüzün Geri Dönüşü'
    },
    child: {
        id: '/manga/olumsuzun-geri-donusu/127-bolum-oku',
        title: 'Bölüm 127'
    },
    entry: {
        index: 1,
        size: 60_628,
        type: 'image/avif'
    }
}).AssertWebsite();