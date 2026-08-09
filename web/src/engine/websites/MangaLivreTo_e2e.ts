import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangalivreto',
        title: 'MangaLivre (.to)'
    },
    container: {
        url: 'https://mangalivre.to/manga/magic-emperor/',
        id: JSON.stringify({ post: '165', slug: '/manga/magic-emperor/' }),
        title: 'Magic Emperor'
    },
    child: {
        id: '/manga/magic-emperor/capitulo-797/',
        title: 'Capitulo 797'
    },
    entry: {
        index: 0,
        size: 579_844,
        type: 'image/webp'
    }
}).AssertWebsite();