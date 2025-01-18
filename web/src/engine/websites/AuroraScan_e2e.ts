/* NW.js crash on website initialize => CloudFlare
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'aurorascan',
        title: 'Aurora Scan'
    }, /* CloudFlare
    container: {
        url: 'https://aurorascan.net/a-boneca-do-quarto-da-princesa/',
        id: '/a-boneca-do-quarto-da-princesa/',
        title: 'A Boneca do Quarto da Princesa'
    },
    child: {
        id: '/a-boneca-do-quarto-da-princesa/00/',
        title: 'Capítulo 00',
    },
    entry: {
        index: 0,
        size: 807_089,
        type: 'image/avif'
    }
}).AssertWebsite();
*/