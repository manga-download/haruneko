import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'catharsisworld',
        title: 'Catharsis World'
    },
    container: {
        url: 'https://newcatharsis.dig-it.info/manga/2236',
        id: '2236/mi-estrella-toma-el-ultimo-tren',
        title: 'Mi estrella toma el último tren'
    },
    child: {
        id: '105830/15',
        title: 'Capítulo 15',
    },
    entry: {
        index: 13,
        size: 2_172_498,
        type: 'image/png'
    }
}).AssertWebsite();