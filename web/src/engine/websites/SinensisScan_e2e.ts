/* NW.js crash on website initialize => CloudFlare
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'sinensisscan',
        title: 'Sinensis Scans',
        timeout: 35000, //warning : WEBSITE IS SLOW IN BROWSER
    },
    container: {
        url: 'https://sinensis.leitorweb.com/a-vida-de-um-passarinho/',
        id: '/a-vida-de-um-passarinho/',
        title: 'A Vida de Um Passarinho',
    },
    child: {
        id: '/a-vida-de-um-passarinho/01/',
        title: 'Capítulo 01',
    },
    entry: {
        index: 0,
        size: 148_236,
        type: 'image/avif'
    }
}).AssertWebsite();
*/