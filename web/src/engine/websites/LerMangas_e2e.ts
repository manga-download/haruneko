import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'lermangas',
        title: 'LerMangas'
    },
    container: {
        url: 'https://lermangas.me/manga/i-randomly-have-a-new-career-every-week/',
        id: JSON.stringify({ post: '944', slug: '/manga/i-randomly-have-a-new-career-every-week/' }),
        title: 'I Randomly Have a New Career Every Week'
    },
    child: {
        id: '/manga/i-randomly-have-a-new-career-every-week/capitulo-232/',
        title: 'Capítulo 232'
    },
    entry: {
        index: 4,
        size: 932_100,
        type: 'image/jpeg'
    }
}).AssertWebsite();