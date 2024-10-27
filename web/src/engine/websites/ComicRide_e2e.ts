import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'comicride',
        title: 'Comic Ride'
    },
    container: {
        url: 'https://comicride.jp/series/24a2c5eb2d433',
        id: '/series/24a2c5eb2d433',
        title: '呪われ侯爵様の訳ありメイド'
    },
    child: {
        id: '/episodes/48d531d8140b5/',
        title: '第1話'
    },
    entry: {
        index: 0,
        size: 3_298_112,
        type: 'image/png'
    }
};

new TestFixture(config).AssertWebsite();