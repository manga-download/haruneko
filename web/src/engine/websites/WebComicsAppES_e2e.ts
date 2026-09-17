import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'webcomicsapp-es',
        title: 'WebComicsApp (Spanish)',
    },
    container: {
        url: 'https://www.webcomicsapp.com/es/acci%C3%B3n/el-coleccionista-de-atributos-del-fin-del-mundo/69607b3b62661d30326b8d72',
        id: '69607b3b62661d30326b8d72',
        title: 'El Coleccionista de Atributos del Fin del Mundo'
    },
    child: {
        id: '48cc13d95d93731abc290183/1',
        title: 'Cap. 1'
    },
    entry: {
        index: 0,
        size: 84_456,
        type: 'image/png'
    }
}).AssertWebsite();