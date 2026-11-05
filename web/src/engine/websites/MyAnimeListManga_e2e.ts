import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'myanimelistmanga',
        title: 'MyAnimeList (Manga)',
    },
    container: {
        url: 'https://myanimelist.net/store/manga/544/1122__For_a_Happy_Marriage',
        id: '/store/manga/544/1122__For_a_Happy_Marriage',
        title: '1122: For a Happy Marriage'
    },
    child: {
        id: '/store/viewer/1/3927/preview',
        title: 'Volume 1 [Preview]'
    },
    entry: {
        index: 0,
        size: 378_061,
        type: 'image/jpeg'
    }
}).AssertWebsite();