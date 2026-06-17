import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangapoisk',
        title: 'MangaPoisk',
    },
    container: {
        url: 'https://mangapsk.ru/manga/dungeon-odyssey-abs3mJl',
        id: '/manga/dungeon-odyssey-abs3mJl',
        title: 'Подземная Одиссея'
    },
    child: {
        id: '/manga/dungeon-odyssey/chapter/1-10',
        title: 'Том 1 Глава 10'
    },
    entry: {
        index: 0,
        size: 1_541_685,
        type: 'image/jpeg'
    }
}).AssertWebsite();