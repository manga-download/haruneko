import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangaruhu',
        title: 'MangaRuhu'
    },
    container: {
        url: 'https://mangaruhu.com/manga/the-dignity-of-a-chaebol/',
        id: '/manga/the-dignity-of-a-chaebol/',
        title: 'Bir Chaebol’ün Onuru'
    },
    child: {
        id: '/manga/the-dignity-of-a-chaebol/bolum-20/',
        title: 'Bölüm 20',
    },
    entry: {
        index: 2,
        size: 1_274_976,
        type: 'image/jpeg'
    }
}).AssertWebsite();