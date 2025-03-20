import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'eternalmangas',
        title: 'Eternal Mangas'
    },
    container: {
        url: 'https://eternalmangas.com/ver/lo-siento-por-ser-una-tonta',
        id: '/ver/lo-siento-por-ser-una-tonta',
        title: 'Lo siento por ser una tonta'
    },
    child: {
        id: '/ver/lo-siento-por-ser-una-tonta/capitulo-14',
        title: 'Capítulo 14'
    },
    entry: {
        index: 0,
        size: 304_618,
        type: 'image/webp'
    }
}).AssertWebsite();