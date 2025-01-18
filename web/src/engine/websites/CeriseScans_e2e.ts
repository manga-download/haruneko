/* NW.js crash on website initialize => CloudFlare
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'cerisescans',
        title: 'Cerise Scans'
    },
    container: {
        url: 'https://cerise.leitorweb.com/apenas-me-deixe-em-paz/',
        id: '/apenas-me-deixe-em-paz/',
        title: 'Apenas Me Deixe em Paz'
    },
    child: {
        id: '/apenas-me-deixe-em-paz/01/',
        title: 'Capítulo 01',
    },
    entry: {
        index: 0,
        size: 171_740,
        type: 'image/avif'
    }
}).AssertWebsite();
*/