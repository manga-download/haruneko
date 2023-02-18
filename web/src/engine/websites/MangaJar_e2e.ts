import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangajar',
        title: 'MangaJar'
    },
    container: {
        url: 'https://mangajar.com/manga/yuan-zun',
        id: '/manga/yuan-zun' ,
        title: 'Yuan Zun'
    },
    child: {
        id: '/manga/yuan-zun/chapter/472.5',
        title: 'Chapter 472.5'
    },
    entry: {
        index: 0,
        size: 560_783,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());