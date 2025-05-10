/* NW.js crash on website initialize => CloudFlare
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'truyengg',
        title: 'TruyenGG'
    },
    container: {
        url: 'https://truyengg.net/truyen-tranh/luyen-khi-chi-than-43774.html',
        id: '/truyen-tranh/luyen-khi-chi-than-43774.html',
        title: 'Luyện Khí Chi Thần'
    },
    child: {
        id: '/truyen-tranh/luyen-khi-chi-than-43774-chap-6.html',
        title: 'Chương 6'
    },
    entry: {
        index: 1,
        size: 174_984,
        type: 'image/jpeg'
    }
}).AssertWebsite();
*/