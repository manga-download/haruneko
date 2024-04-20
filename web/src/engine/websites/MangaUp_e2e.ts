import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangaup',
        title: 'MangaUp'
    },
    container: {
        url: 'https://global.manga-up.com/manga/86',
        id: '86',
        title: 'A Dating Sim of Life or Death'
    },
    child: {
        id: '6285',
        title: 'Chapter 1.1'
    },
    entry: {
        index: 0,
        size: 164_230,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());