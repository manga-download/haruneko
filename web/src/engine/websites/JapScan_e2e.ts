import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Single Reader
new TestFixture({
    plugin: {
        id: 'japscan',
        title: 'JapScan'
    },
    container: {
        url: 'https://www.japscan.si/manga/jujutsu-kaisen/',
        id: '/manga/jujutsu-kaisen/',
        title: 'Jujutsu Kaisen'
    }, /* Reader is protected by CloudFlare with ~10 minute challenge reset
    child: {
        id: '/manga/jujutsu-kaisen/1/',
        title: 'Chapitre 1: Esprit à double-face'
    },
    entry: {
        index: 0,
        size: 614_256,
        type: 'image/jpeg'
    }*/
}).AssertWebsite();

// CASE: Full Reader
new TestFixture({
    plugin: {
        id: 'japscan',
        title: 'JapScan'
    },
    container: {
        url: 'https://www.japscan.si/manga/king-game/',
        id: '/manga/king-game/',
        title: 'King Game'
    }, /* Reader is protected by CloudFlare with ~10 minute challenge reset
    child: {
        id: '/manga/king-game/1/',
        title: 'Chapitre 1'
    },
    entry: {
        index: 0,
        size: 173_855,
        type: 'image/jpeg'
    }*/
}).AssertWebsite();