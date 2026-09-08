import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manhwaweb',
        title: 'ManhwaWeb'
    },
    container: {
        url: 'https://manhwaweb.com/manhwa/pequea-acosadora_1761090368216',
        id: 'pequea-acosadora_1761090368216',
        title: 'Pequeña Acosadora'
    },
    child: {
        id: 'pequea-acosadora_1761090368216-1_01',
        title: '1'
    },
    entry: {
        index: 2,
        size: 450_536,
        type: 'image/webp'
    }
}).AssertWebsite();