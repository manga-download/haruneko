import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'holyscans',
        title: 'HolyScans'
    },
    container: {
        url: 'https://holyscans.com.tr/manga/baska-bir-dunyada-bekar-baba/',
        id: JSON.stringify({ post: '1924', slug: '/manga/baska-bir-dunyada-bekar-baba/' }),
        title: 'Başka Bir Dünyada Bekâr Baba'
    },
    child: {
        id: '/manga/baska-bir-dunyada-bekar-baba/bolum-2/',
        title: 'Bölüm 2'
    },
    entry: {
        index: 1,
        size: 1_206_858,
        type: 'image/webp'
    }
}).AssertWebsite();