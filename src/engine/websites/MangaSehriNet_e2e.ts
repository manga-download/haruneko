import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangasehrinet',
        title: 'Manga Şehri (.NET)'
    },
    container: {
        url: 'https://manga-sehri.net/manga/oshi-no-ko/',
        id: JSON.stringify({ post: '1133', slug: '/manga/oshi-no-ko/' }),
        title: 'Oshi no Ko'
    },
    child: {
        id: '/manga/oshi-no-ko/bolum-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 1,
        size: 503_801,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();