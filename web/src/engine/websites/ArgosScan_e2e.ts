import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'argosscan',
        title: 'Argos Scan'
    },
    container: {
        url: 'https://argoscomic.com/manga/o-apocalipse-chegou/',
        id: '/manga/o-apocalipse-chegou/',
        title: 'O Apocalipse Chegou',
        timeout: 10000

    },
    child: {
        id: '/manga/o-apocalipse-chegou/1a-temporada/capitulo-09/',
        title: 'Capítulo 09',
    },
    entry: {
        index: 1,
        size: 271_682,
        type: 'image/webp'
    }
}).AssertWebsite();