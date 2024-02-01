import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'yugenmangas-pt',
        title: 'YugenMangas (PT)'
    },
    container: {
        url: 'https://yugenmangas.net.br/series/para-amar-seu-inimigo',
        id: 'para-amar-seu-inimigo',
        title: 'Para Amar seu Inimigo'
    },
    child: {
        id: 'capitulo-31',
        title: 'Capítulo 31'
    },
    entry: {
        index: 3,
        size: 111_768,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());