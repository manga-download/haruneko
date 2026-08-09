import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ninemanga-ru',
        title: 'NineMangaRU'
    },
    container: {
        url: 'https://ru.niadd.com/manga/Рождение сильнейшего мастера.html',
        id: encodeURI('/manga/Рождение сильнейшего мастера.html'),
        title: 'Рождение сильнейшего мастера',
    },
    child: {
        id: encodeURI('/chapter/1_308/3940336/'),
        title: 'Том 1 Глава 308',
    },
    entry: {
        index: 0,
        size: 375_292,
        type: 'image/webp'
    }
}).AssertWebsite();