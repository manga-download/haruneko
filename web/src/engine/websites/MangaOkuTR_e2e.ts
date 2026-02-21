import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangaokutr',
        title: 'Manga Oku TR'
    },
    container: {
        url: 'https://mangaokutr.net/manga/baekssisega-sihanbu-gongja/',
        id: '/manga/baekssisega-sihanbu-gongja/',
        title: 'Baekssisega Sihanbu Gongja'
    },
    child: {
        id: '/baekssisega-sihanbu-gongja-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 0,
        size: 118_763,
        type: 'image/avif'
    }
}).AssertWebsite();