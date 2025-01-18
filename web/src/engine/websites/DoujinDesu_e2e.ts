/* NW.js crash on website initialize => CloudFlare
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'doujindesu',
        title: 'DoujinDesu'
    },
    container: {
        url: 'https://doujindesu.tv/manga/hero-villain/',
        id: '/manga/hero-villain/',
        title: 'Hero Villain'
    },
    child: {
        id: '/2022/02/19/hero-villain-chapter-01/',
        title: 'Chapter 01'
    },
    entry: {
        index: 1,
        size: 1_115_560,
        type: 'image/jpeg'
    }
}).AssertWebsite();
*/