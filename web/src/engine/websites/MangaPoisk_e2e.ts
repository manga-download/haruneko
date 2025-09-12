import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangapoisk',
        title: 'MangaPoisk',
    },
    container: {
        url: 'https://mangapoisk.io/manga/i-need-sponsorship',
        id: '/manga/i-need-sponsorship',
        title: 'Мне нужен спонсор'
    },
    child: {
        id: '/manga/i-need-sponsorship/chapter/1-26',
        title: '26 Том 1'
    },
    entry: {
        index: 0,
        size: 248_126,
        type: 'image/webp'
    }
}).AssertWebsite();