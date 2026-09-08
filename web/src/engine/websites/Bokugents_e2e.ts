import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'bokugents',
        title: 'Bokugen Translation'
    },
    container: {
        url: 'https://bokugents.com/manga/yumemiru/',
        id: '/manga/yumemiru/',
        title: 'Yumemiru Danshi wa Genjitsushugisha'
    },
    child: {
        id: '/yumemiru-cap-33-1/',
        title: 'Chapter 31.1'
    },
    entry: {
        index: 0,
        size: 462_648,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();