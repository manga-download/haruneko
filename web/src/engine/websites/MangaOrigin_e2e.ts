import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangaorigin',
        title: 'Manga Origin'
    },
    container: {
        url: 'https://mangaoriginread.blogspot.com/search/label/Blue%20Lock',
        id: '/search/label/Blue%20Lock',
        title: 'Blue Lock'
    },
    child: {
        id: '/2024/02/blue-lock-253.html',
        title: 'Blue lock - 253 النسخة الرسمية'
    },
    entry: {
        index: 2,
        size: 973_255,
        type: 'image/jpeg'
    }
}).AssertWebsite();