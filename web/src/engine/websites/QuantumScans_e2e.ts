import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'quantumscans',
        title: 'Quantum Scans'
    },
    container: {
        url: 'https://quantumtoon.com/series/628e2319b4b/',
        id: '/series/628e2319b4b/',
        title: 'Celestial Phase'
    },
    child: {
        id: '/chapter/628e2319b4b-628e242ce6f/',
        title: 'Chapter 47'
    },
    entry: {
        index: 0,
        size: 775_821,
        type: 'image/jpeg'
    }
}).AssertWebsite();