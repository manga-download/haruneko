import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'anisamanga',
        title: 'Anisa manga'
    },
    container: {
        url: 'https://anisamanga.net/manga/summer-scent/',
        id: '/manga/summer-scent/',
        title: 'Summer Scent'
    },
    child: {
        id: '/summer-scent-bolum-13/',
        title: 'Bölüm 13'
    }, /* Need Login
    entry: {
        index: 1,
        size: 1_297_242,
        type: 'image/jpeg'
    }*/
}).AssertWebsite();