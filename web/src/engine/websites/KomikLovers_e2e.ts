import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'komiklovers',
        title: 'KomiLovers'
    },
    container: {
        url: 'https://komiklovers.com/komik/blade-of-retribution/',
        id: '/komik/blade-of-retribution/',
        title: 'Blade of Retribution'
    },
    child: {
        id: '/blade-of-retribution-chapter-10/',
        title: 'Chapter 10'
    },
    entry: {
        index: 1,
        size: 394_750,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();