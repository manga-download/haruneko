import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'starboundscans',
        title: 'Starbound Scans'
    },
    container: {
        url: 'https://starboundscans.com/manga/academy-s-genius-swordmaster/',
        id: '/manga/academy-s-genius-swordmaster/',
        title: `Academy’s Genius Swordmaster`
    },
    child: {
        id: '/manga/academy-s-genius-swordmaster/chapitre-67/',
        title: 'Chapitre 67'
    },
    entry: {
        index: 11,
        size: 853_304,
        type: 'image/avif'
    }
}).AssertWebsite();