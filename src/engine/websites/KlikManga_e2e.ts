import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'klikmanga',
        title: 'KlikManga'
    },
    container: {
        url: 'https://klikmanga.org/manga/yuusha-yamemasu/',
        id: JSON.stringify({ post: '1851', slug: '/manga/yuusha-yamemasu/' }),
        title: 'Yuusha, Yamemasu'
    },
    child: {
        id: '/manga/yuusha-yamemasu/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 260_747,
        type: 'image/jpeg'
    }
}).AssertWebsite();