import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'kazescans',
        title: 'Kaze Scans',
    },
    container: {
        url: 'https://www.kazescans.com/2026/01/chronicles-of-demon-faction.html',
        id: '/2026/01/chronicles-of-demon-faction.html',
        title: 'Chronicles of the Demon Faction',
    },
    child: {
        id: '/2026/01/chronicles-of-demon-faction-bolum-91.html',
        title: 'Bölüm 91',
    },
    entry: {
        index: 0,
        size: 1_058_394,
        type: 'image/jpeg'
    }
}).AssertWebsite();