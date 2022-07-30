import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'yugenmangas-pt',
        title: 'YugenMangas (PT)'
    },
    container: {
        url: 'https://yugenmangas.com.br/series/obscene-baguette/',
        id: JSON.stringify({ post: '19607', slug: '/series/obscene-baguette/' }),
        title: 'Obscene Baguette'
    },
    child: {
        id: '/series/obscene-baguette/capitulo-0/',
        title: 'Capítulo 0'
    },
    entry: {
        index: 1,
        size: 90_370,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());