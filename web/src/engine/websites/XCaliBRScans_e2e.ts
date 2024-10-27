import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Plain Images
new TestFixture({
    plugin: {
        id: 'xcalibrscans',
        title: 'xCaliBR Scans'
    },
    container: {
        url: 'https://xcalibrscans.com/webcomics/manga/the-first-ancestor-in-history/',
        id: '/webcomics/manga/the-first-ancestor-in-history/',
        title: 'The First Ancestor in History'
    },
    child: {
        id: '/the-first-ancestor-in-history-chapter-1/',
        title: 'Chapter 1',
    },
    entry: {
        index: 0,
        size: 771_615,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// CASE: Scrambled Single Page Images
new TestFixture({
    plugin: {
        id: 'xcalibrscans',
        title: 'xCaliBR Scans'
    },
    container: {
        url: 'https://xcalibrscans.com/webcomics/manga/the-first-ancestor-in-history/',
        id: '/webcomics/manga/the-first-ancestor-in-history/',
        title: 'The First Ancestor in History'
    },
    child: {
        id: '/the-first-ancestor-in-history-chapter-86/',
        title: 'Chapter 86',
    },
    entry: {
        index: 0,
        size: 5_250_563,
        type: 'image/png'
    }
}).AssertWebsite();

// CASE: Scrambled Double Page Images
new TestFixture({
    plugin: {
        id: 'xcalibrscans',
        title: 'xCaliBR Scans'
    },
    container: {
        url: 'https://xcalibrscans.com/webcomics/manga/above-ten-thousand-people/',
        id: '/webcomics/manga/above-ten-thousand-people/',
        title: 'Above Ten Thousand'
    },
    child: {
        id: '/above-ten-thousand-people-chapter-175/',
        title: 'Chapter 175',
    },
    entry: {
        index: 0,
        size: 5_771_810,
        type: 'image/png'
    }
}).AssertWebsite();