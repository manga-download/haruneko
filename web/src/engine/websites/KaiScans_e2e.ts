import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'kaiscans',
        title: 'Kai Scans'
    },
    container: {
        url: 'https://kaiscans.org/manga/my-in-laws-are-obsessed-with-me-9571/',
        id: '/manga/my-in-laws-are-obsessed-with-me-9571/',
        title: 'My In-Laws Are Obsessed With Me'
    },
    child: {
        id: '/my-in-laws-are-obsessed-with-me-chapter-96/',
        title: 'Chapter 96'
    },
    entry: {
        index: 1,
        size: 1_318_903,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());