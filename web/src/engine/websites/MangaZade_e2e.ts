import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangazade',
        title: 'MangaZade'
    },
    container: {
        url: 'https://mangazade.com/manga/girls-x-vampire/',
        id: JSON.stringify({ post: '354', slug: '/manga/girls-x-vampire/' }),
        title: 'Girls x Vampire'
    },
    child: {
        id: '/manga/girls-x-vampire/bolum-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 0,
        size: 308_028,
        type: 'image/jpeg'
    }
}).AssertWebsite();