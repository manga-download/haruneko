import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangaonlineblog',
        title: 'Manga Online Blog'
    },
    container: {
        url: 'https://mangaonline.red/manga/eleceed/',
        id: '/manga/eleceed/',
        title: 'Eleceed',
    },
    child: {
        id: '/capitulo/eleceed-capitulo-416/',
        title: 'Cap. 416',
    },
    entry: {
        index: 1,
        size: 582_502,
        type: 'image/webp'
    }
}).AssertWebsite();