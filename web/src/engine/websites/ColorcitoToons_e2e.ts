import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'colorcitotoons',
        title: 'Colorcito Toons'
    },
    container: {
        url: 'https://colorcitotoons.site/ver/antologia-yuri-verano-lluvioso',
        id: 'antologia-yuri-verano-lluvioso',
        title: 'Antologia Yuri-Verano Lluvioso'
    },
    child: {
        id: 'capitulo-1',
        title: 'Cap. 1'
    },
    entry: {
        index: 0,
        size: 703_240,
        type: 'image/jpeg'
    }
}).AssertWebsite();