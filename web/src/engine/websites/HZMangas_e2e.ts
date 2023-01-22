import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hzmangas',
        title: 'Hz Manga'
    },
    container: {
        url: 'https://hzmangas.com/manga/teenage-mercenary-delete/',
        id: JSON.stringify({ post: '87', slug: '/manga/teenage-mercenary-delete/' }),
        title: 'Teenage Mercenary'
    },
    child: {
        id: '/manga/teenage-mercenary-delete/ch-000/',
        title: 'Ch.000'
    },
    entry: {
        index: 0,
        size: 122_884,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());