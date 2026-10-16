import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'eternalmangas',
        title: 'Eternal Mangas'
    },
    container: {
        url: 'https://eternalmangas.org/series/winterfield',
        id: '/series/winterfield',
        title: 'Winterfield'
    },
    child: {
        id: '/series/winterfield/chapter-8',
        title: 'Capítulo 8'
    },
    entry: {
        index: 4,
        size: 645_514,
        type: 'image/webp'
    }
}).AssertWebsite();