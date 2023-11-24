import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'cosmicscans',
        title: 'Cosmic Scans'
    },
    container: {
        url: 'https://cosmic-scans.com/manga/6969-eleceed/',
        id: '/manga/6969-eleceed/',
        title: 'Eleceed'
    },
    child: {
        id: '/eleceed-chapter-272/',
        title: 'Chapter 272'
    },
    entry: {
        index: 0,
        size: 176_688,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());