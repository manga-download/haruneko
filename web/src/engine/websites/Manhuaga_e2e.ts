import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manhuaga',
        title: 'Manhuaga'
    },
    container: {
        url: 'https://manhuaga.com/manga/from-goblin-to-goblin-god/',
        id: '/manga/from-goblin-to-goblin-god/',
        title: 'From Goblin to Goblin God'
    },
    child: {
        id: '/from-goblin-to-goblin-god-chapter-45/',
        title: 'Chapter 45'
    },
    entry: {
        index: 0,
        size: 1_529_140,
        type: 'image/webp'
    }
}).AssertWebsite();