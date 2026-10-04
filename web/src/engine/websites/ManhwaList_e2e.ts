import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manhwalist',
        title: 'Manhwa List'
    },
    container: {
        url: 'https://manhwalist.asia/manga/lookism/',
        id: '/manga/lookism/',
        title: 'Lookism'
    },
    child: {
        id: '/lookism-chapter-623/',
        title: 'Chapter 623 Fix',
        timeout: 15_000
    },
    entry: {
        index: 0,
        size: 471_554,
        type: 'image/jpeg'
    }
}).AssertWebsite();