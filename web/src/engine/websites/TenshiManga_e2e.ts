import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'tenshimanga',
        title: 'Tenshi Manga'
    },
    container: {
        url: 'https://tenshimanga.com/manga/77/999-seviye-goblin',
        id: '/manga/77/999-seviye-goblin',
        title: '999 Seviye Goblin'
    },
    child: {
        id: '/manga/77/999-seviye-goblin/1880/11-bolum',
        title: 'B�l�m 11'
    },
    entry: {
        index: 0,
        size: 114_585,
        type: 'image/jpeg'
    }
}).AssertWebsite();