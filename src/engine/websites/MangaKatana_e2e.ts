import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangakatana',
        title: 'MangaKatana'
    },
    container: {
        url: 'https://mangakatana.com/manga/musuko-ga-kawaikute-shikataganai-mazoku-no-hahaoya.17231',
        id: '/manga/musuko-ga-kawaikute-shikataganai-mazoku-no-hahaoya.17231',
        title: 'Musuko ga Kawaikute Shikataganai Mazoku no Hahaoya'
    },
    child: {
        id: '/manga/musuko-ga-kawaikute-shikataganai-mazoku-no-hahaoya.17231/c187',
        title: 'Chapter 187: Going Home'
    },
    entry: {
        index: 0,
        size: 240_996,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();