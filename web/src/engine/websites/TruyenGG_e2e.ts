import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'truyengg',
        title: 'TruyenGG'
    }, /* CloudFlare
    container: {
        url: 'https://truyengg.com/truyen-tranh/luyen-khi-chi-than-43774.html',
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
    } */
};

new TestFixture(config).AssertWebsite();