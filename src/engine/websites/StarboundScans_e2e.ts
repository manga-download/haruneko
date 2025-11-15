import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Continuous Images
new TestFixture({
    plugin: {
        id: 'starboundscans',
        title: 'Starbound Scans',
    },
    container: {
        url: 'https://starboundscans.com/manga/academy-s-genius-swordmaster/',
        id: '{"slug":"/manga/academy-s-genius-swordmaster/"}',
        title: `Academy’s Genius Swordmaster`,
    },
    child: {
        id: '/manga/academy-s-genius-swordmaster/chapitre-67/?style=list',
        title: 'Chapitre 67',
    },
    entry: {
        index: 11,
        size: 853_304,
        type: 'image/avif',
    }
}).AssertWebsite();

// CASE: Paginated Images
new TestFixture({
    plugin: {
        id: 'starboundscans',
        title: 'Starbound Scans'
    },
    container: {
        url: 'https://starboundscans.com/manga/catenaccio/',
        id: '{"slug":"/manga/catenaccio/"}',
        title: 'Catenaccio',
    },
    child: {
        id: '/manga/catenaccio/chapitre-8/?style=list',
        title: `Chapitre 8 - Peur de l'échec (5)`,
    },
    entry: {
        index: 11,
        size: 430_248,
        type: 'image/avif',
    }
}).AssertWebsite();