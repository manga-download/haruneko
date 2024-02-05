import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'majorscans',
        title: 'Major Scans'
    },
    container: {
        url: 'https://www.majorscans.com/manga/standard-of-reincarnation/',
        id: JSON.stringify({ slug: '/manga/standard-of-reincarnation/' }),
        title: 'Standard of Reincarnation'
    },
    child: {
        id: '/manga/standard-of-reincarnation/chapter-86-4/',
        title: 'Chapter 86.4'
    },
    entry: {
        index: 0,
        size: 390_932,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());