import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhwalist',
        title: 'Manhwa List'
    },
    /* CloudFlare
    container: {
        url: 'https://manhwalist.in/manga/lookism/',
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
    }*/
};

new TestFixture(config).AssertWebsite();