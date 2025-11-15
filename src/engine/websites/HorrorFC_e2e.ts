import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'horrorfc',
        title: 'HorrorFC'
    },
    container: {
        url: 'https://horrorfc.com/genkai-chitai/',
        id: '/genkai-chitai/',
        title: 'Genkai Chitai'
    },
    child: {
        id: '/genkai-chitai-phantom-zone-ii-2-aether-forest/',
        title: 'Phantom Zone II 2 – Aether Forest'
    },
    entry: {
        index: 1,
        size: 1_659_687,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();