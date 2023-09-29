import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangaokur',
        title: 'Manga Okur'
    },
    container: {
        url: 'https://mangaokur.com/manga/i-am-the-fated-villain/',
        id: JSON.stringify({ post: '30', slug: '/manga/i-am-the-fated-villain/' }),
        title: 'I Am the Fated Villain'
    },
    child: {
        id: '/manga/i-am-the-fated-villain/bolum-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 1,
        size: 1_073_182,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());