import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangaesp',
        title: 'MangaEsp'
    },
    container: {
        url: 'https://mangaesp.topmanhuas.org/manga/fuera-de-lo-habitual/',
        id: '/manga/fuera-de-lo-habitual/',
        title: 'Fuera de lo Habitual'
    },
    child: {
        id: '/fuera-de-lo-habitual-triple-amenaza-2/',
        title: 'Chapter 350'
    },
    entry: {
        index: 1,
        size: 492_346,
        type: 'image/jpeg'
    }
}).AssertWebsite();