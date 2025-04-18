/* NW.js crash on website initialize => CloudFlare
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'cmangax',
        title: 'CMangax'
    },
    container: {
        url: 'https://cmangax1.com/album/trong-sinh-chi-quan-chu-80929',
        id: '80929',
        title: 'trọng sinh chi quân chủ'
    },
    child: {
        id: '2198086',
        title: '11'
    },
    entry: {
        index: 2,
        size: 94_988,
        type: 'image/jpeg'
    }
}).AssertWebsite();
*/