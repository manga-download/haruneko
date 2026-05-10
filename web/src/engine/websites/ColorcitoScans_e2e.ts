import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'colorcitoscans',
        title: 'Colorcito Scans'
    },
    container: {
        url: 'https://colorcitoscan.com/ver/por-fin-contigo',
        id: 'por-fin-contigo',
        title: 'Por Fin Contigo'
    },
    child: {
        id: 'capitulo-23',
        title: '23'
    },
    entry: {
        index: 0,
        size: 2_603_681,
        type: 'image/jpeg'
    }
}).AssertWebsite();