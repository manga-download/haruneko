import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'alphascans',
        title: 'Alpha Scans'
    },
    container: {
        url: 'https://alpha-scans.org/manga/the-tax-reaper/',
        id: '/manga/the-tax-reaper/',
        title: 'The Tax Reaper'
    },
    child: {
        id: '/the-tax-reaper-chapter-0/',
        title: 'Chapter 0'
    },
    entry: {
        index: 0,
        size: 1_072_523,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());