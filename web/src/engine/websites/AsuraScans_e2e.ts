import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'asurascans',
        title: 'Asura Scans',
    },
    container: {
        url: 'https://asuracomics.com/manga/4243005272-reaper-of-the-drifting-moon/',
        id: '/manga/4243005272-reaper-of-the-drifting-moon/',
        title: 'Reaper of the Drifting Moon',
    },
    child: {
        id: '/4533579728-reaper-of-the-drifting-moon-chapter-0/',
        title: 'Chapter 0',
    },
    entry: {
        index: 1,
        size: 3_140_564,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());