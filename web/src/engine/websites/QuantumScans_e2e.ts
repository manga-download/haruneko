import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'quantumscans',
        title: 'Quantum Scans'
    },
    container: {
        url: 'https://quantumtoon.com/series/celestial-phenomenon',
        id: JSON.stringify({ id: '5', slug: 'celestial-phenomenon' }),
        title: 'Celestial Phenomenon'
    },
    child: {
        id: JSON.stringify({ id: '435', slug: 'chapter-47' }),
        title: 'Chapter 47'
    },
    entry: {
        index: 1,
        size: 4_544_610,
        type: 'image/jpeg'
    }
}).AssertWebsite();