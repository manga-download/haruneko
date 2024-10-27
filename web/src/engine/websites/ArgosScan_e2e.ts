import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'argosscan',
        title: 'Argos Scan'
    },
    container: {
        url: 'https://argoscomic.com/manga/apocalipse-implacavel/',
        id: '/manga/apocalipse-implacavel/',
        title: 'Apocalipse Implacavel',
        timeout: 10000

    },
    child: {
        id: '/manga/apocalipse-implacavel/1a-temporada/capitulo-01/',
        title: 'Capítulo 01',
    },
    entry: {
        index: 1,
        size: 190_316,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();