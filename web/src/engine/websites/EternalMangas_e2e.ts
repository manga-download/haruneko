import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'eternalmangas',
        title: 'Eternal Mangas'
    },
    container: {
        url: 'https://eternalmangas.org/series/winterfield',
        id: '3229',
        title: 'Winterfield'
    },
    child: {
        id: '/series/winterfield/chapter-8',
        title: 'Chapter 8'
    },
    entry: {
        index: 4,
        size: 645_514,
        type: 'image/webp'
    }
}).AssertWebsite();