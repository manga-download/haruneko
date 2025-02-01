/* NW.js crash on website initialize => CloudFlare
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'sctoon',
        title: 'SCtoon',
    },
    container: {
        url: 'https://sctoon.net/a-vida-de-um-passarinho0/',
        id: '/a-vida-de-um-passarinho0/',
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