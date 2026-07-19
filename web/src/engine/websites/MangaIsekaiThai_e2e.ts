import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangaisekaithai',
        title: 'MangaIsekaiThai'
    },
    container: {
        url: 'https://www.mangaisekaithai.net/manga/taimashi-tensei/',
        id: JSON.stringify({ post: '4088', slug: '/manga/taimashi-tensei/' }),
        title: 'Taimashi Tensei'
    },
    child: {
        id: encodeURI('/manga/taimashi-tensei/ตอนที่-2-2/').toLowerCase(),
        title: 'ตอนที่ 2.2'
    },
    entry: {
        index: 1,
        size: 181_347,
        type: 'image/jpeg'
    }
}).AssertWebsite();