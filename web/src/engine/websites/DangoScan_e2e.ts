import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'dangoscan',
        title: 'Dango Scan',
    },
    container: {
        url: 'https://dangoscan.com.br/a-confissao-do-rei-demonio/',
        id: '/a-confissao-do-rei-demonio/',
        title: 'A Confissão do Rei Demônio',
    },
    child: {
        id: '/a-confissao-do-rei-demonio/17/',
        title: 'Capítulo 17 - Espada deixada pelo Paladino #5',
        timeout: 15000
    },
    entry: {
        index: 1,
        size: 89_928,
        type: 'image/avif'
    }
};

new TestFixture(config).AssertWebsite();