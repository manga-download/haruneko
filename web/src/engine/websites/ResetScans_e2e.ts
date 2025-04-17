/* NW.js crash on website initialize => CloudFlare
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'resetscans',
        title: 'Reset Scans'
    },
    container: {
        url: 'https://rspro.xyz/manga/stuck-in-the-tower/',
        id: JSON.stringify({ post: '6418', slug: '/manga/stuck-in-the-tower/' }),
        title: 'Stuck in the Tower'
    },
    child: {
        id: '/manga/stuck-in-the-tower/chapter-91/',
        title: 'Chapter 91'
    },
    entry: {
        index: 0,
        size: 275_130,
        type: 'image/webp'
    }
}).AssertWebsite();
*/