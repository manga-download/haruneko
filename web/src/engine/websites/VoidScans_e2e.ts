import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'voidscans',
        title: 'Void Scans'
    },
    container: {
        url: 'https://hivescans.com/manga/99-reinforced-wooden-stick/',
        id: '/manga/99-reinforced-wooden-stick/',
        title: '+99 Reinforced Wooden Stick'
    },
    child: {
        id: '/99-reinforced-wooden-stick-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 303_264,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());