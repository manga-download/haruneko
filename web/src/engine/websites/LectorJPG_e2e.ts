import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'lectorjpg',
        title: 'VisorJPG'
    },
    container: {
        url: 'https://visorjpg.lat/series/killer-beat',
        id: 'killer-beat',
        title: 'Killer Beat'
    },
    child: {
        id: '12039',
        title: 'Capitulo 1'
    },
    entry: {
        index: 0,
        size: 931_556,
        type: 'image/webp'
    }
}).AssertWebsite();