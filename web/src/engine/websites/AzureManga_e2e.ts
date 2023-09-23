import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'azuremanga',
        title: 'Azure Manga'
    },
    container: {
        url: 'https://azuremanga.com/manga/the-last-human/',
        id: '/manga/the-last-human/',
        title: 'The Last Human'
    },
    child: {
        id: '/the-last-human-chapter-400/',
        title: 'Chapter 400'
    },
    entry: {
        index: 1,
        size: 1_578_321,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());