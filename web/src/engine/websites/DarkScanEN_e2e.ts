import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'darkscan-en',
        title: 'DarkScan (EN)'
    },
    container: {
        url: 'https://dark-scan.com/manga/only-i-know-that-the-world-will-end/',
        id: JSON.stringify({ post: '26', slug: '/manga/only-i-know-that-the-world-will-end/' }),
        title: 'Only I Know That the World Will End'
    },
    child: {
        id: '/manga/only-i-know-that-the-world-will-end/chapter-55/',
        title: 'Chapter 55'
    },
    entry: {
        index: 0,
        size: 522_084,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());