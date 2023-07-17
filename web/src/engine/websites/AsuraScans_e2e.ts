import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'asurascans',
        title: 'Asura Scans'
    },
    container: {
        url: 'https://asura.gg/manga/0223090894-reaper-of-the-drifting-moon/',
        id: '/manga/0223090894-reaper-of-the-drifting-moon/',
        title: 'Reaper of the Drifting Moon'
    },
    child: {
        id: '/2226495089-reaper-of-the-drifting-moon-chapter-0/',
        title: 'Chapter 0'
    },
    entry: {
        index: 1,
        size: 1_119_224,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());