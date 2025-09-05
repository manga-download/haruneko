import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'uzaymanga',
        title: 'Uzay Manga'
    },
    container: {
        url: 'https://uzaymanga.com/manga/52/olumsuzun-yolu',
        id: '/manga/52/olumsuzun-yolu',
        title: 'Ölümsüzün Yolu'
    },
    child: {
        id: '/manga/52/olumsuzun-yolu/6249/118-bolum',
        title: 'Bölüm 118'
    },
    entry: {
        index: 0,
        size: 766_697,
        type: 'image/jpeg'
    }
}).AssertWebsite();