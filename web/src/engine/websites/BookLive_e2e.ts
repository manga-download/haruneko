import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'booklive',
        title: 'BookLive'
    },
    container: {
        url: 'https://booklive.jp/product/index/title_id/20063601/vol_no/001',
        id: '/product/index/title_id/20063601/vol_no/001',
        title: '火の神さまの掃除人ですが、いつの間にか花嫁として溺愛されています【単話】 1'
    },
    child: {
        id: '/bviewer/s/?cid=60095158_001',
        title: '001'
    },
    entry: {
        index: 0,
        size: 2_200_103,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());