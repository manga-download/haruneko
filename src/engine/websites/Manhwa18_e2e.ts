/* NW.js crash on website initialize => CloudFlare
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manhwa18',
        title: 'Manhwa 18 (.com)',
    },
    container: {
        url: 'https://manhwa18.com/manga/may-i-help-you',
        id: '/manga/may-i-help-you',
        title: 'May I Help You?',
    },
    child: {
        id: '/manga/may-i-help-you/chap-01-678',
        title: 'chap 01',
    },
    entry: {
        index: 0,
        size: 476_512,
        type: 'image/jpeg',
    }
}).AssertWebsite();
*/