import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'quantumscans',
        title: 'Qi Scans'
    },
    container: {
        url: 'https://qimanhwa.com/series/celestial-phenomenon',
        id: 'celestial-phenomenon',
        title: 'Celestial Phenomenon'
    },
    child: {
        id: 'chapter-76',
        title: 'Chapter 76'
    },
    entry: {
        index: 1,
        size: 1_915_066,
        type: 'image/jpeg'
    }
}).AssertWebsite();