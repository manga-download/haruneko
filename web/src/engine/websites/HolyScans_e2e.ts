import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'holyscans',
        title: 'HolyScans'
    },
    container: {
        url: 'https://holyscans.com.tr/manga/kutsal-hac-yolculugu-coskusu/',
        id: '/manga/kutsal-hac-yolculugu-coskusu/',
        title: 'Kutsal Hac Yolculuğu Coşkusu'
    },
    child: {
        id: '/manga/kutsal-hac-yolculugu-coskusu/bolum-1-1/',
        title: 'bölüm 1.1',
        timeout: 15_000
    },
    entry: {
        index: 0,
        size: 432_264,
        type: 'image/webp'
    }
}).AssertWebsite();