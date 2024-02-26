import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'luratoon',
        title: 'Lura Toon'
    },
    container: {
        url: 'https://luratoon.com/manga/eu-caminho-na-noite1/',
        id: JSON.stringify({ post: '73', slug: '/manga/eu-caminho-na-noite1/' }),
        title: 'Eu Caminho na Noite consumido Pelas Lâminas'
    },
    child: {
        id: '/manga/eu-caminho-na-noite1/cap-01/',
        title: 'Cap. 01'
    },
    entry: {
        index: 1,
        size: 548_165,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());