import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hunterscan',
        title: 'Hunters Scan'
    }, /* CloudFlare
    container: {
        url: 'https://htoons.online/series/civilizacao-de-nebula/',
        id: JSON.stringify({ post: '6001', slug: '/series/civilizacao-de-nebula/' }),
        title: 'Civilização de Nebula'
    },
    child: {
        id: '/series/civilizacao-de-nebula/capitulo-37/',
        title: 'Capítulo 37'
    },
    entry: {
        index: 1,
        size: 3_308_367,
        type: 'image/jpeg'
    }*/
};

new TestFixture(config).AssertWebsite();