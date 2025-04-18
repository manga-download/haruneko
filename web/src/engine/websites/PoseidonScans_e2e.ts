/* NW.js crash on website initialize => CloudFlare
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'poseidonscans',
        title: 'Poseidon Scans'
    },
    container: {
        url: 'https://poseidonscans.fr/manga/ending-maker/',
        id: JSON.stringify({ post: '4857', slug : '/manga/ending-maker/'}),
        title: 'Ending Maker'
    },
    child: {
        id: '/manga/ending-maker/chapitre-1/',
        title: 'Chapitre 1'
    },
    entry: {
        index: 1,
        size: 561_605,
        type: 'image/webp'
    }
}).AssertWebsite();
*/