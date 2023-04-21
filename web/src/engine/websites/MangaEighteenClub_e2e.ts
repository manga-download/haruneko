import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manga18-club',
        title: 'Manga18.club'
    },
    container: {
        url: 'https://manga18.club/manhwa/maid-rehabilitation',
        id: '/manhwa/maid-rehabilitation',
        title: 'Maid Rehabilitation'
    },
    child: {
        id: '/manhwa/maid-rehabilitation/chapter-34',
        title: 'Chapter 34'
    },
    entry: {
        index: 0,
        size: 1_450_666,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());