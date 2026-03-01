import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Regular puzzles
new TestFixture({
    plugin: {
        id: 'mangapro',
        title: 'ProChan'
    },
    container: {
        url: 'https://prochan.net/series/manhua/399/awakening-sss-rank-skill-after-a-kiss',
        id: '/series/manhua/399/awakening-sss-rank-skill-after-a-kiss',
        title: 'Awakening SSS-Rank skill after a Kiss'
    },
    child: {
        id: '/series/manhua/399/awakening-sss-rank-skill-after-a-kiss/22222/91',
        title: 'Chapter 91',
    },
    entry: {
        index: 0,
        size: 298_990,
        type: 'image/avif'
    }
}).AssertWebsite();

// CASE: Encrypted Puzzle Data : "Browser"
new TestFixture({
    plugin: {
        id: 'mangapro',
        title: 'ProChan'
    },
    container: {
        url: 'https://prochan.net/series/manhwa/492/the-villain-wants-to-live',
        id: '/series/manhwa/492/the-villain-wants-to-live',
        title: 'The Villain Wants to Live.'
    },
    child: {
        id: '/series/manhwa/492/the-villain-wants-to-live/38647/46',
        title: 'Chapter 46',
    },
    entry: {
        index: 7,
        size: 1_468_235,
        type: 'image/png'
    }
}).AssertWebsite();