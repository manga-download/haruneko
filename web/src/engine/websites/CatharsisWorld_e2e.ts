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
    }, /* Captcha is not shown in test environment
    child: {
        id: '105830/15',
        title: 'Capítulo 15',
    },
    entry: {
        index: 14,
        size: 1_202_225,
        type: 'image/png'
    }*/
}).AssertWebsite();