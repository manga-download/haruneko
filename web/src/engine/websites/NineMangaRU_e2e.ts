import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'ninemanga-ru',
        title: 'NineMangaRU'
    },
    container: {
        url: 'https://ru.ninemanga.com/manga/%D0%A0%D0%BE%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D0%B5+%D1%81%D0%B8%D0%BB%D1%8C%D0%BD%D0%B5%D0%B9%D1%88%D0%B5%D0%B3%D0%BE+%D0%BC%D0%B0%D1%81%D1%82%D0%B5%D1%80%D0%B0.html',
        id: '/manga/%D0%A0%D0%BE%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D0%B5+%D1%81%D0%B8%D0%BB%D1%8C%D0%BD%D0%B5%D0%B9%D1%88%D0%B5%D0%B3%D0%BE+%D0%BC%D0%B0%D1%81%D1%82%D0%B5%D1%80%D0%B0.html',
        title: 'Рождение сильнейшего мастера Манга (The Distinguished Cute Master)',
    },
    child: {
        id: '/chapter/%D0%A0%D0%BE%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%81%D0%B8%D0%BB%D1%8C%D0%BD%D0%B5%D0%B9%D1%88%D0%B5%D0%B3%D0%BE%20%D0%BC%D0%B0%D1%81%D1%82%D0%B5%D1%80%D0%B0/3940336.html',
        title: 'Рождение сильнейшего мастера Том 1 Глава 308',
    },
    entry: {
        index: 0,
        size: 375_292,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());