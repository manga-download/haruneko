/* NW.js crash on website initialize => CloudFlare
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'arvenscans',
        title: 'Arven Scans'
    },
    container: {
        url: 'https://arvencomics.com/series/baeac6b0188/',
        id: '/series/baeac6b0188/',
        title: 'Solo Necromancy'
    },
    child: {
        id: '/chapter/baeac6b0188-a37a0a5eeb0/',
        title: 'Chapter 146'
    },
    entry: {
        index: 1,
        size: 250_796,
        type: 'image/webp'
    }
}).AssertWebsite();
*/