import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangaflame',
        title: 'MangaFlame'
    },
    container: {
        url: 'https://mangaflame.org/manga/apocalyptic-super-farm/',
        id: '/manga/apocalyptic-super-farm/',
        title: 'Apocalyptic super farm'
    },
    child: {
        id: '/apocalyptic-super-farm-25/',
        title: 'فصل 25'
    },
    entry: {
        index: 0,
        size: 125_553,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());