import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'ruyamanga',
        title: 'Rüya Manga'
    },
    container: {
        url: 'https://www.ruya-manga.com/manga/deli-muhendis/',
        id: JSON.stringify({ post: '126199', slug: '/manga/deli-muhendis/' }),
        title: 'Deli Mühendis'
    },
    child: {
        id: '/manga/deli-muhendis/bolum-118/',
        title: 'Bölüm 118'
    },
    entry: {
        index: 0,
        size: 51_272,
        type: 'image/webp'
    }

};

new TestFixture(config).AssertWebsite();