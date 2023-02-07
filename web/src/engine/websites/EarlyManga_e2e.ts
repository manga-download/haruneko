import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'earlymanga',
        title: 'EarlyManga'
    },
    container: {
        url: 'https://earlym.org/manga/i-took-over-the-demonic-ancestor',
        id: '/manga/i-took-over-the-demonic-ancestor',
        title: 'I Took Over the Demonic Ancestor'
    },
    child: {
        id: '/manga/i-took-over-the-demonic-ancestor/chapter-35',
        title: 'Chapter 35'
    },
    entry: {
        index: 0,
        size: 256_982,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());