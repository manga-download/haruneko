import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'rfdragonscan',
        title: 'RF Dragon Scan',
    },
    container: {
        url: 'https://rfdragonscan.com/deus-do-apocalipse/',
        id: '/deus-do-apocalipse/',
        title: 'Deus do Apocalipse',
    },
    child: {
        id: '/deus-do-apocalipse/10/',
        title: 'Capítulo 10',
    },
    entry: {
        index: 0,
        size: 273_580,
        type: 'image/avif'
    }
}).AssertWebsite();