import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'shijiescans',
        title: 'Shijie Scans'
    },
    container: {
        url: 'https://shijiescans.com/seri/gel-beni-al/',
        id: '/seri/gel-beni-al/',
        title: 'Gel Beni Al!'
    },
    child: {
        id: '/gel-beni-al-bolum-80/',
        title: 'Bölüm 80'
    },
    entry: {
        index: 0,
        size: 426_608,
        type: 'image/webp'
    }
}).AssertWebsite();