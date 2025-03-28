import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangabook',
        title: 'MangaBook'
    },
    container: {
        url: 'https://mangabook.org/manga/i-m-stepmother-but-daughter-is-too-cute',
        id: '/manga/i-m-stepmother-but-daughter-is-too-cute',
        title: `Я мачеха, но моя дочь слишком милая / I'm stepmother but daughter is too cute`
    },
    child: {
        id: '/manga/i-m-stepmother-but-daughter-is-too-cute/v4-ch133',
        title: 'Глава №133'
    },
    entry: {
        index: 1,
        size: 373_797,
        type: 'image/jpeg'
    }
}).AssertWebsite();