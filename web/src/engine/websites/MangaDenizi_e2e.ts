import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangadenizi',
        title: 'MangaDenizi'
    },
    container: {
        url: 'https://www.mangadenizi.net/manga/that-girl-is-cute-but-dangerous',
        id: '/manga/that-girl-is-cute-but-dangerous',
        title: 'That Girl Is Cute... But Dangerous?'
    },
    child: {
        id: '/manga/that-girl-is-cute-but-dangerous/36',
        title: '- Bölüm 36'
    },
    entry: {
        index: 1,
        size: 403_693,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());