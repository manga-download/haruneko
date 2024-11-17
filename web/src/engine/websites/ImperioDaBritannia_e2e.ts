import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
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
        id: '/manga/profissao-sem-valor-domador-de-dragoes/capitulo-52/',
        title: 'Capítulo 52'
    },
    entry: {
        index: 0,
        size: 900_462,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();