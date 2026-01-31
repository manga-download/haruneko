import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mechacomic',
        title: 'MechaComic'
    },
    container: {
        url: 'https://mechacomic.jp/books/165155',
        id: '/books/165155',
        title: '鬼畜英雄【G!TOON版】'
    },
    child: {
        id: '/free_chapters/2215258/download/050845030e9e52d07b2b83e66d130bdbb4b30aa6',
        title: '001話 - (1)',
    },
    entry: {
        index: 0,
        size: 114_694,
        type: 'image/webp'
    }
}).AssertWebsite();