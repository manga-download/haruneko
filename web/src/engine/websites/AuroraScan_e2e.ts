/* NW.js crash on website initialize => CloudFlare
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'aurorascan',
        title: 'Aurora Scan',
    },
    container: {
        url: 'https://aurorascan.net/te-adoro-professora/',
        id: '/te-adoro-professora/',
        title: 'Te Adoro, Professora',
    },
    child: {
        id: '/te-adoro-professora/a-vida-de-um-passarinho/01/',
        title: 'Capítulo 01',
    },
    entry: {
        index: 0,
        size: 148_236,
        type: 'image/avif'
    }
}).AssertWebsite();
*/