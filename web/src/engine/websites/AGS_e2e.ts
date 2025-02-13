/* NW.js crash on website initialize => CloudFlare
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ags',
        title: 'AGR (Animated Glitched Comics)'
    },
    container: {
        url: 'https://agrcomics.com/series/a4126222129/',
        id: '/series/a4126222129/',
        title: 'Reincarnated as the Mastermind of the Story'
    },
    child: {
        id: '/chapter/a4126222129-cb8dddee90e/',
        title: 'Chapter 23'
    },
    entry: {
        index: 1,
        size: 290_812,
        type: 'image/jpeg'
    }
}).AssertWebsite();
*/