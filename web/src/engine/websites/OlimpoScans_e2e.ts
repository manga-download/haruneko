import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'olimposcans',
        title: 'OlimpoScans'
    },
    container: {
        url: 'https://leerolimpo.com/comic-bjorn-el-barbaro.html',
        id: '/comic-bjorn-el-barbaro.html',
        title: 'BJORN EL BARBARO'
    },
    child: {
        id: '/leer-bjorn-el-barbaro-capitulo-50.html',
        title: 'Capítulo 50',
    },
    entry: {
        index: 1,
        size: 273_422,
        type: 'image/webp'
    }
}).AssertWebsite();