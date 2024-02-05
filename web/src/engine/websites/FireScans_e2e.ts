import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'firescans',
        title: 'FireScans'
    },
    container: {
        url: 'https://firescans.xyz/manga/i-am-the-fated-villain/',
        id: JSON.stringify({ post: '367', slug: '/manga/i-am-the-fated-villain/' }),
        title: 'I Am the Fated Villain'
    },
    child: {
        id: '/manga/i-am-the-fated-villain/chapter-130/',
        title: 'Chapter 130'
    },
    entry: {
        index: 0,
        size: 1_342_712,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());