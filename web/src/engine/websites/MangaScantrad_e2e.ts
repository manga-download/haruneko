import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manga-scantrad',
        title: 'Manga-Scantrad'
    },
    container: {
        url: 'https://manga-scantrad.io/manga/martial-peak/',
        id: JSON.stringify({ post: '3280', slug: '/manga/martial-peak/' }),
        title: 'Martial Peak'
    },
    child: {
        id: '/manga/martial-peak/chapitre-1321/',
        title: 'Chapitre 1321'
    },
    entry: {
        index: 2,
        size: 446_328,
        type: 'image/jpeg'
    }
}).AssertWebsite();