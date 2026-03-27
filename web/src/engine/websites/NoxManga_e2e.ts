import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'noxmanga',
        title: 'NoxManga'
    },
    container: {
        url: 'https://noxmanga.co/manga/despertar-em-tempo-integral',
        id: 'despertar-em-tempo-integral',
        title: 'Despertar em Tempo Integral'
    },
    child: {
        id: '/ler/despertar-em-tempo-integral/capitulo-1',
        title: 'Capítulo 1'
    },
    entry: {
        index: 1,
        size: 2_865_220,
        type: 'image/webp'
    }
}).AssertWebsite();