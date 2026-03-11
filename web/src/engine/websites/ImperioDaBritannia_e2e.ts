import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'imperiodabritania',
        title: 'Imperio Da Britannia'
    },
    container: {
        url: 'https://imperiodabritannia.com/manga/profissao-sem-valor-domador-de-dragoes/',
        id: JSON.stringify({ post: '3742', slug: '/manga/profissao-sem-valor-domador-de-dragoes/' }),
        title: 'Profissão sem Valor: Domador de Dragões'
    },
    child: {
        id: '/manga/profissao-sem-valor-domador-de-dragoes/cap-52/',
        title: 'Cap. 52'
    },
    entry: {
        index: 5,
        size: 2_005_104,
        type: 'image/jpeg'
    }
}).AssertWebsite();