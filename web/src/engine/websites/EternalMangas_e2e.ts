import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'eternalmangas',
        title: 'Eternal Mangas'
    },
    container: {
        url: 'https://eternalmangas.org/series/lo-siento-por-ser-una-tonta',
        id: JSON.stringify({ slug: 'lo-siento-por-ser-una-tonta', id: 1582}),
        title: 'Lo siento por ser una tonta'
    },
    child: {
        id: '/series/lo-siento-por-ser-una-tonta/capitulo-14',
        title: '14'
    },
    entry: {
        index: 0,
        size: 304_618,
        type: 'image/webp'
    }
}).AssertWebsite();