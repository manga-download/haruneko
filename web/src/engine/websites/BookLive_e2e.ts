import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'booklive',
        title: 'BookLive'
    },
    container: {
        url: 'https://booklive.jp/product/index/title_id/20063601/vol_no/001',
        id: '/product/index/title_id/20063601/vol_no/001',
        title: '火の神さまの掃除人ですが、いつの間にか花嫁として溺愛されています【単話】'
    },
    child: {
        id: '/bviewer/s/?cid=60206931_001',
        title: '1'
    },
    entry: {
        index: 0,
        size: 2_399_255,
        type: 'image/png'
    }
}).AssertWebsite();