import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangarussia',
        title: 'MangaRussia'
    },
    container: {
        url: 'https://www.mangarussia.com/manga/%D0%94%D0%B0%D0%BD%D0%B4%D0%B0%D0%B4%D0%B0%D0%BD.html',
        id: '/manga/%D0%94%D0%B0%D0%BD%D0%B4%D0%B0%D0%B4%D0%B0%D0%BD.html',
        title: 'Дандадан',
    },
    child: {
        id: '/chapter/%D0%94%D0%B0%D0%BD%D0%B4%D0%B0%D0%B4%D0%B0%D0%BD+%D0%A2%D0%BE%D0%BC+13+%D0%93%D0%BB%D0%B0%D0%B2%D0%B0+113/3940271/',
        title: 'Том 13 Глава 113',
    },
    entry: {
        index: 0,
        size: 1_503_963,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());