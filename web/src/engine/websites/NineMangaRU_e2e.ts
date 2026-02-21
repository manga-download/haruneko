import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ninemanga-ru',
        title: 'NineMangaRU'
    },
    container: {
        url: 'https://ru.ninemanga.com/manga/Рождение+сильнейшего+мастера.html',
        id: encodeURI('/manga/Рождение+сильнейшего+мастера.html'),
        title: 'Рождение сильнейшего мастера Манга (The Distinguished Cute Master)',
    },
    child: {
        id: encodeURI('/chapter/Рождение сильнейшего мастера/3940336.html'),
        title: 'Рождение сильнейшего мастера Том 1 Глава 308',
    },
    entry: {
        index: 0,
        size: 375_292,
        type: 'image/webp'
    }
}).AssertWebsite();