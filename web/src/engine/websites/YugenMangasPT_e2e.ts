import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'yugenmangas-pt',
        title: 'YugenMangas (PT)'
    },
    container: {
        url: 'https://yugenmangas.com.br/series/para-amar-seu-inimigo/',
        id: JSON.stringify({ post: '17954', slug: '/series/para-amar-seu-inimigo/' }),
        title: 'Para Amar seu Inimigo'
    },
    child: {
        id: '/series/para-amar-seu-inimigo/capitulo-31/',
        title: 'Capítulo 31'
    },
    entry: {
        index: 1,
        size: 117_205,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());