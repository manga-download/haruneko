import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'irisscanlator',
        title: 'Iris Scanlator'
    },
    container: {
        url: 'https://irisscanlator.com.br/manga/orenchi-no-maid-san/',
        id: JSON.stringify({ post: '82', slug: '/manga/orenchi-no-maid-san/' }),
        title: 'Orenchi no Maid-san'
    },
    child: {
        id: '/manga/orenchi-no-maid-san/capitulo-01/',
        title: 'Capítulo 01'
    },
    entry: {
        index: 0,
        size: 407_663,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());