import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'lectorjpg',
        title: 'LectorJPG'
    },
    container: {
        url: 'https://lectorjpg.com/series/killer-beat',
        id: '/series/killer-beat',
        title: 'Killer Beat'
    },
    child: {
        id: '/read/killer-beat/12039',
        title: 'Capitulo 1'
    },
    entry: {
        index: 0,
        size: 931_556,
        type: 'image/webp'
    }
}).AssertWebsite();