import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangapluscreators',
        title: 'Manga Plus Creators'
    },
    container: {
        url: 'https://mangaplus-creators.jp/titles/6u2509141835180027269321',
        id: '/titles/6u2509141835180027269321',
        title: 'SOUSEISOUSEN (en)'
    },
    child: {
        id: '/episodes/zh2601071715300027269321',
        title: '#30'
    },
    entry: {
        index: 0,
        size: 186_535,
        type: 'image/jpeg'
    }
}).AssertWebsite();