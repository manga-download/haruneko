import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'projetoscanlator',
        title: 'Projeto Scanlator'
    },
    container: {
        url: 'https://projetoscanlator.com/manga/mokushiroku-no-yonkishi/',
        id: JSON.stringify({ post: '3812', slug: '/manga/mokushiroku-no-yonkishi/' }),
        title: 'Mokushiroku no Yonkishi'
    },
    child: {
        id: '/manga/mokushiroku-no-yonkishi/capitulo-01/',
        title: 'Capítulo 01 - O garoto zarpa'
    },
    entry: {
        index: 0,
        size: 1_068_667,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());