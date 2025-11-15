import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangakings',
        title: 'Manga Kings'
    },
    container: {
        url: 'https://mangakings.com.tr/manga/azur-lane/',
        id: '/manga/azur-lane/',
        title: 'Azur Lane Slow Ahead'
    },
    child: {
        id: '/azur-lane-bolum-35/',
        title: 'Bölüm 35'
    },
    entry: {
        index: 1,
        size: 1_213_488,
        type: 'image/png'
    }
};

new TestFixture(config).AssertWebsite();