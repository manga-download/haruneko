import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manhwalist',
        title: 'Manhwa List'
    },
    container: {
        url: 'https://manhwalist02.site/manga/lookism/',
        id: '/manga/lookism/',
        title: 'Lookism'
    },
    child: {
        id: '/lookism-chapter-478-indonesia-terbaru/',
        title: 'Chapter 478'
    },
    entry: {
        index: 0,
        size: 95_488,
        type: 'image/jpeg'
    }
}).AssertWebsite();