import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'astrascans',
        title: 'AstraScans'
    },
    container: {
        url: 'https://astrascans.com/10000/the-end-is-a-game-to-me/',
        id: '/10000/the-end-is-a-game-to-me/',
        title: 'The End Is a Game to Me'
    },
    child: {
        id: '/the-end-is-a-game-to-me-chapter-22/',
        title: 'Chapter 22'
    },
    entry: {
        index: 2,
        size: 746_557,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());