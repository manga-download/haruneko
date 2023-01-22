import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'asurascans',
        title: 'Asura Scans'
    },
    container: {
        url: 'https://www.asurascans.com/manga/reaper-of-the-drifting-moon/',
        id: '/manga/reaper-of-the-drifting-moon/',
        title: 'Reaper of the Drifting Moon'
    },
    child: {
        id: '/reaper-of-the-drifting-moon-chapter-0/',
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