import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'aincardmanga',
        title: 'Aincard Manga'
    },
    container: {
        url: 'https://aincardmanga.com.tr/manga/gakkou-gurashi/',
        id: JSON.stringify({ post: '117', slug: '/manga/gakkou-gurashi/' }),
        title: 'Gakkou Gurashi!'
    },
    child: {
        id: '/manga/gakkou-gurashi/bolum-56/',
        title: 'Bölüm 56'
    },
    entry: {
        index: 1,
        size: 299_716,
        type: 'image/webp'
    }
}).AssertWebsite();