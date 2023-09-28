import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'randomscan',
        title: 'Random Scans'
    },
    container: {
        url: 'https://randomscanlators.net/manga/eu-caminho-na-noite-consumido-pelas-laminas/',
        id: JSON.stringify({ post: '73', slug: '/manga/eu-caminho-na-noite-consumido-pelas-laminas/' }),
        title: 'Eu Caminho na Noite consumido Pelas Lâminas'
    },
    child: {
        id: '/manga/eu-caminho-na-noite-consumido-pelas-laminas/cap-01/',
        title: 'Cap. 01'
    },
    entry: {
        index: 1,
        size: 574_291,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());