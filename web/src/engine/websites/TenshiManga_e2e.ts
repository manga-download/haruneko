import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'tenshimanga',
        title: 'Tenshi Manga'
    },
    container: {
        url: 'https://tenshimanga.com/manga/999-seviye-goblin',
        id: '999-seviye-goblin',
        title: '999 Seviye Goblin'
    },
    child: {
        id: '/manga/999-seviye-goblin/11-bolum-oku',
        title: 'Bölüm 11'
    },
    entry: {
        index: 2,
        size: 75_537,
        type: 'image/avif'
    }
}).AssertWebsite();