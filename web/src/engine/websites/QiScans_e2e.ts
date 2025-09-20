import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'quantumscans',
        title: 'Qi Scans'
    },
    container: {
        url: 'https://qiscans.org/series/celestial-phenomenon',
        id: '5',
        title: 'Celestial Phenomenon'
    },
    child: {
        id: '/series/celestial-phenomenon/chapter-76',
        title: 'Chapter 76'
    },
    entry: {
        index: 1,
        size: 1_915_066,
        type: 'image/jpeg'
    }
}).AssertWebsite();