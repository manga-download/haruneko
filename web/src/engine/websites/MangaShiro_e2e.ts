import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangashiro',
        title: 'MangaShiro'
    },
    container: {
        url: 'https://mangashiro.me/manga/star-martial-god-technique/',
        id: '/manga/star-martial-god-technique/',
        title: 'Star Martial God Technique'
    },
    child: {
        id: '/star-martial-god-technique-chapter-01/',
        title: 'Chapter 01'
    },
    entry: {
        index: 2,
        size: 115_931,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());