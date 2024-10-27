import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'samuraiscan',
        title: 'Samurai Scan'
    },
    container: {
        url: 'https://latan.visorsmr.com/dl/camino-celestial-del-maestro-marcial-estelar/',
        id: JSON.stringify({ post: '39', slug: '/dl/camino-celestial-del-maestro-marcial-estelar/' }),
        title: 'Camino Celestial del Maestro Marcial Estelar'
    },
    child: {
        id: '/dl/camino-celestial-del-maestro-marcial-estelar/capitulo-1/',
        title: 'Capitulo 1',
    },
    entry: {
        index: 0,
        size: 85_402,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();