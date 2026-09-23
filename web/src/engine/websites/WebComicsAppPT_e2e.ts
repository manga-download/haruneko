import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'webcomicsapp-pt',
        title: 'WebComicsApp (Portuguese)',
    },
    container: {
        url: 'https://www.webcomicsapp.com/pt/fic%C3%A7%C3%A3o/o-%C3%BAltimo-her%C3%B3i/6836b68962661d7335241b5d',
        id: '6836b68962661d7335241b5d',
        title: 'O Último Herói'
    },
    child: {
        id: '0614009920c6987b6ebc437d/1',
        title: 'Cap. 1'
    },
    entry: {
        index: 0,
        size: 82_518,
        type: 'image/png'
    }
}).AssertWebsite();