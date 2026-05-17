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
        id: '58678df6-4ba2-4af2-9ce3-e16068f0a2db',
        title: 'Capítulo 1'
    },
    entry: {
        index: 1,
        size: 2_865_220,
        type: 'image/webp'
    }
}).AssertWebsite();