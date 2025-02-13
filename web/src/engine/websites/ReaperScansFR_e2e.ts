/* NW.js crash on website initialize => CloudFlare
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'reaperscansfr',
        title: 'Reaper Scans (French)'
    },
    container: {
        url: 'https://reaper-scans.fr/series/4ba82a00e72/',
        id: '/series/4ba82a00e72/',
        title: 'Solo Leveling'
    },
    child: {
        id: '/chapter/4ba82a00e72-3c7a1bde772/',
        title: 'Chapter 179'
    },
    entry: {
        index: 2,
        size: 1_539_628,
        type: 'image/jpeg'
    }
}).AssertWebsite();
*/