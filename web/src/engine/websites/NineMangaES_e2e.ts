import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'ninemanga-es',
        title: 'NineMangaES'
    },
    container: {
        url: 'https://es.ninemanga.com/manga/Martial+Peak.html',
        id: '/manga/Martial+Peak.html',
        title: 'Martial Peak',
    },
    child: {
        id: '/chapter/Martial%20Peak/1855269.html',
        title: 'Capitulo 3440',
        timeout: 15000

    },
    entry: {
        index: 1,
        size: 110_242,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();