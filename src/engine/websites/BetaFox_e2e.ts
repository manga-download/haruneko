import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'betafox',
        title: 'Beta Fox'
    },
    container: {
        url: 'https://www.betafox.net/webtoon/tower-of-god/',
        id: JSON.stringify({ post: '54', slug: '/webtoon/tower-of-god/' }),
        title: 'Tower of God'
    },
    child: {
        id: '/webtoon/tower-of-god/chapter-0/',
        title: 'Chapter 0'
    },
    entry: {
        index: 0,
        size: 65_139,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());