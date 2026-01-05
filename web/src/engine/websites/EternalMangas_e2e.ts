import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'eternalmangas',
        title: 'Eternal Mangas'
    },
    container: {
        url: 'https://eternalmangas.org/series/advertencia-sobre-bestias-salvajes',
        id: '2942',
        title: 'Advertencia sobre bestias salvajes'
    },
    child: {
        id: '/series/advertencia-sobre-bestias-salvajes/chapter-1',
        title: 'Chapter 1'
    },
    entry: {
        index: 7,
        size: 64_630,
        type: 'image/webp'
    }
}).AssertWebsite();