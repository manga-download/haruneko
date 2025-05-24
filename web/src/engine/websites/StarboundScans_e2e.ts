/* NW.js crash on website initialize => CloudFlare
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'starboundscans',
        title: 'Starbound Scans'
    },
    container: {
        url: 'https://starboundscans.com/webtoon/e7e2c66d-190d-4bbb-b3d0-cabd17522ace',
        id: 'e7e2c66d-190d-4bbb-b3d0-cabd17522ace',
        title: `Academy's Genius Swordmaster`
    },
    child: {
        id: '46bf48aa-f4f8-4832-b804-521232d37c99',
        title: 'Chapitre 45'
    },
    entry: {
        index: 1,
        size: 651_094,
        type: 'image/webp'
    }
}).AssertWebsite();
*/