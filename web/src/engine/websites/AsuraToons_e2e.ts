import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'asuratoons',
        title: 'Asura Toons',
    },
    container: {
        url: 'https://www.asuratoons.info/manga/tomb-raider-king',
        id: '/manga/tomb-raider-king',
        title: 'Tomb Raider King',
    },
    child: {
        id: '/manga/tomb-raider-king/chapter/411',
        title: 'Chapter 411',
    },
    entry: {
        index: 2,
        size: 320_800,
        type: 'image/webp'
    }
}).AssertWebsite();