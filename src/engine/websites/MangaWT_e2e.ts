import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangawt',
        title: 'MangaWT'
    },
    container: {
        url: 'https://mangawt.com/manga/bir-dagda-baslamak/',
        id: JSON.stringify({ post: '1871', slug: '/manga/bir-dagda-baslamak/' }),
        title: 'Bir Dağda Başlamak'
    },
    child: {
        id: '/manga/bir-dagda-baslamak/bolum-0/',
        title: 'Bölüm 0',
        timeout: 10000
    },
    entry: {
        index: 1,
        size: 530_593,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();