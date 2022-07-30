import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'ichirinnohanayuri',
        title: 'Ichirin No Hana Yuri'
    },
    container: {
        url: 'https://ichirinnohanayuriscan.com/manga/weakness/',
        id: JSON.stringify({ post: '20033', slug: '/manga/weakness/' }),
        title: 'WEAKNESS'
    },
    child: {
        id: '/manga/weakness/capitulo-00/',
        title: 'Capítulo 00 - Prólogo'
    },
    entry: {
        index: 0,
        size: 303_196,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());