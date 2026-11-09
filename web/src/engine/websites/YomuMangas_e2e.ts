import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'yomumangas',
        title: 'Yomu Mangas',
    },
    container: {
        url: 'https://yomumangas.com/mangas/11/kingdom',
        id: '/mangas/11/kingdom',
        title: 'Kingdom',
    },
    child: {
        id: '/mangas/11/kingdom/835',
        title: 'Ch. 835',
    },
    entry: {
        index: 1,
        size: 424_165,
        type: 'image/avif',
    }
}).AssertWebsite();