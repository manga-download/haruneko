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
        title: 'Bölüm 11'
    },
    entry: {
        index: 2,
        size: 114_585,
        type: 'image/jpeg'
    }
}).AssertWebsite();