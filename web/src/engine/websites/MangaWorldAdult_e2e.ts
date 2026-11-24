import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangaworldadult',
        title: 'Manga World Adult'
    },
    container: {
        url: 'https://www.mangaworldadult.org/manga/1089/15y',
        id: '/manga/1089/15y',
        title: '15Y+'
    },
    child: {
        id: '/manga/1089/15y/read/5f7e3f9e6c6c3610d5922b81',
        title: 'Capitolo 20'
    },
    entry: {
        index: 0,
        size: 79_800,
        type: 'image/jpeg'
    }
}).AssertWebsite();