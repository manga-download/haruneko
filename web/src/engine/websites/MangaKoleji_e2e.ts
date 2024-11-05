import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangakoleji',
        title: 'Manga Koleji'
    },
    container: {
        url: 'https://mangakoleji.com/manga/fighting-ward/',
        id: '/manga/fighting-ward/',
        title: 'Fighting Ward'
    },
    child: {
        id: '/fighting-ward-bolum-1/',
        title: 'Bölüm 1',
    },
    entry: {
        index: 0,
        size: 466_765,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();