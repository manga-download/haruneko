import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'kedi',
        title: 'Kedi Manga'
    },
    container: {
        url: 'https://kedimanga.com/manga/blue-lock/',
        id: '/manga/blue-lock/',
        title: 'Blue Lock'
    },
    child: {
        id: '/manga/blue-lock/bolum-303/',
        title: 'Bölüm 303'
    },
    entry: {
        index: 0,
        size: 207_696,
        type: 'image/webp'
    }
}).AssertWebsite();