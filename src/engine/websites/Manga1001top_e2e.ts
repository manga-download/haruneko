import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manga1001top',
        title: 'Manga1001.top'
    },
    container: {
        url: 'https://manga1001.top/return-of-the-frozen-player',
        id: '/return-of-the-frozen-player',
        title: 'Return Of The Frozen Player'
    },
    child: {
        id: '/return-of-the-frozen-player/chapter-0',
        title: 'Chapter 0'
    },
    entry: {
        index: 0,
        size: 118_988,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());