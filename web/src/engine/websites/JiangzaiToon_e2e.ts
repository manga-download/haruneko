import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'jiangzaiToon',
        title: 'JiangzaiToon'
    },
    container: {
        url: 'https://jiangzaitoon.gay/manga/19-gun/',
        id: JSON.stringify({ post: '6872', slug: '/manga/19-gun/' }),
        title: '19 Days'
    },
    child: {
        id: '/manga/19-gun/bolum-353-skec/',
        title: 'Bölüm 353 - Skeç'
    },
    entry: {
        index: 1,
        size: 2_803_320,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();