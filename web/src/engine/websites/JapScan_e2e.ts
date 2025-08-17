import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Single Reader (Manga)
new TestFixture({
    plugin: {
        id: 'japscan',
        title: 'JapScan'
    },
    container: {
        url: 'https://www.japscan.si/manga/jujutsu-kaisen/',
        id: '/manga/jujutsu-kaisen/',
        title: 'Jujutsu Kaisen'
    },
    child: {
        id: '/manga/jujutsu-kaisen/1/',
        title: 'Chapitre 1: Esprit à double-face'
    },
    entry: {
        index: 2,
        size: 246_579,
        type: 'image/png'
    }
}).AssertWebsite();

// CASE: Full Reader (Manhwa)
new TestFixture({
    plugin: {
        id: 'japscan',
        title: 'JapScan'
    },
    container: {
        url: 'https://www.japscan.si/manhwa/king-game/',
        id: '/manhwa/king-game/',
        title: 'King Game'
    },
    child: {
        id: '/manhwa/king-game/1/',
        title: 'Chapitre 1'
    },
    entry: {
        index: 0,
        size: 173_855,
        type: 'image/jpeg'
    }
}).AssertWebsite();