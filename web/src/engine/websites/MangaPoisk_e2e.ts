﻿import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangapoisk',
        title: 'MangaPoisk',
    },
    container: {
        url: 'https://mangapoisk.io/manga/dungeon-odyssey',
        id: '/manga/dungeon-odyssey',
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